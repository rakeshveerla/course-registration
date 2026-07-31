  // ---------- Data (now loaded from the Spring Boot backend, not hardcoded) ----------
  let courses = [];   // will be filled by loadData() from GET /api/courses
  let students = [];  // will be filled by loadData() from GET /api/students
  let editingId = null; // null = adding new

  const tableBody = document.getElementById('tableBody');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const programFilter = document.getElementById('programFilter');

  const card = document.getElementById('card');
  const scrim = document.getElementById('scrim');
  const cardTab = document.getElementById('cardTab');
  const cardTitle = document.getElementById('cardTitle');
  const cardSub = document.getElementById('cardSub');
  const fName = document.getElementById('fName');
  const fEmail = document.getElementById('fEmail');
  const fProgram = document.getElementById('fProgram');
  const fSemester = document.getElementById('fSemester');
  const courseList = document.getElementById('courseList');

  // ---------- Talking to the backend ----------
  // All the frontend needs to know is these 2 URLs. Everything else (MySQL,
  // JPA, etc.) is handled by the Spring Boot server.
  const API_STUDENTS = '/api/students';
  const API_COURSES = '/api/courses';

  async function loadData(){
    courses = await fetch(API_COURSES).then(r => r.json());
    students = await fetch(API_STUDENTS).then(r => r.json());
    populateProgramFilter();
    renderTable();
  }

  function seatsTakenFor(courseId, excludeStudentId){
    return students.filter(s => s.id !== excludeStudentId && s.courseIds.includes(courseId)).length;
  }

  function seatsRemaining(courseId, excludeStudentId){
    const course = courses.find(c => c.id === courseId);
    return course.seats - seatsTakenFor(courseId, excludeStudentId);
  }

  function populateProgramFilter(){
    const programs = [...new Set(students.map(s => s.program))];
    programFilter.innerHTML = '<option value="">All programs</option>' +
      programs.map(p => `<option value="${p}">${p}</option>`).join('');
  }

  function renderStats(){
    const totalEnrollments = students.reduce((sum, s) => sum + s.courseIds.length, 0);
    const totalSeatsOffered = courses.reduce((sum, c) => sum + c.seats, 0);
    document.getElementById('statStudents').textContent = students.length;
    document.getElementById('statCourses').textContent = courses.length;
    document.getElementById('statEnrollments').textContent = totalEnrollments;
    document.getElementById('statSeats').textContent = Math.max(totalSeatsOffered - totalEnrollments, 0);
  }

  function courseLabel(id){
    const c = courses.find(c => c.id === id);
    return c ? c.code : id;
  }

  function renderTable(){
    const q = searchInput.value.trim().toLowerCase();
    const prog = programFilter.value;

    const filtered = students.filter(s => {
      const matchesQ = !q || s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchesProg = !prog || s.program === prog;
      return matchesQ && matchesProg;
    });

    tableBody.innerHTML = filtered.map(s => `
      <tr>
        <td data-label="Roll No." class="roll">${s.roll}</td>
        <td data-label="Student">
          <div class="name">${escapeHtml(s.name)}</div>
          <div class="email">${escapeHtml(s.email)}</div>
        </td>
        <td data-label="Program">${escapeHtml(s.program)} · Sem ${s.semester}</td>
        <td data-label="Courses">
          <div class="chips">
            ${s.courseIds.length ? s.courseIds.map(cid => `<span class="chip">${courseLabel(cid)}</span>`).join('') : '<span class="chip empty">None</span>'}
          </div>
        </td>
        <td data-label="">
          <div class="row-actions">
            <button class="icon-btn" onclick="openEditor(${s.id})">Edit</button>
            <button class="icon-btn danger" onclick="deleteStudent(${s.id})">Remove</button>
          </div>
        </td>
      </tr>
    `).join('');

    emptyState.style.display = filtered.length ? 'none' : 'block';
    renderStats();
  }

  function escapeHtml(str){
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderCourseList(currentStudentId, selectedCourses){
    courseList.innerHTML = courses.map(c => {
      const remaining = seatsRemaining(c.id, currentStudentId);
      const isChecked = selectedCourses.includes(c.id);
      const isFull = remaining <= 0 && !isChecked;
      return `
        <label class="course-item ${isFull ? 'full' : ''}">
          <input type="checkbox" value="${c.id}" ${isChecked ? 'checked' : ''} ${isFull ? 'disabled' : ''}>
          <span class="cname">${c.code} — ${c.title}</span>
          <span class="cseats">${isFull ? 'Full' : remaining + ' left'}</span>
        </label>
      `;
    }).join('');
  }

  function openEditor(studentId){
    editingId = studentId;
    const isNew = studentId === null;
    const student = isNew
      ? { name:'', email:'', program: fProgram.options[0].value, semester:'1', courseIds:[] }
      : students.find(s => s.id === studentId);

    cardTab.textContent = isNew ? 'New Record' : 'Edit Record';
    cardTitle.textContent = isNew ? 'Add Student' : 'Edit Student';
    cardSub.textContent = isNew ? 'A new roll number will be assigned' : student.roll;

    fName.value = student.name;
    fEmail.value = student.email;
    fProgram.value = student.program;
    fSemester.value = student.semester;

    renderCourseList(isNew ? null : student.id, student.courseIds);

    card.classList.add('open');
    scrim.classList.add('open');
    fName.focus();
  }

  function closeEditor(){
    card.classList.remove('open');
    scrim.classList.remove('open');
    editingId = null;
  }

  async function saveStudent(){
    const name = fName.value.trim();
    const email = fEmail.value.trim();
    if(!name || !email){
      alert('Please fill in both name and email.');
      return;
    }
    // Checkbox values come out of the DOM as strings, so convert them to
    // numbers to match the ids the backend uses.
    const selectedCourses = Array.from(courseList.querySelectorAll('input[type=checkbox]:checked'))
        .map(cb => Number(cb.value));

    const payload = {
      name,
      email,
      program: fProgram.value,
      semester: fSemester.value,
      courseIds: selectedCourses
    };

    if(editingId === null){
      await fetch(API_STUDENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch(`${API_STUDENTS}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    closeEditor();
    students = await fetch(API_STUDENTS).then(r => r.json());
    populateProgramFilter();
    renderTable();
  }

  async function deleteStudent(id){
    const student = students.find(s => s.id === id);
    if(!student) return;
    if(confirm(`Remove ${student.name} (${student.roll}) from the roll?`)){
      await fetch(`${API_STUDENTS}/${id}`, { method: 'DELETE' });
      students = await fetch(API_STUDENTS).then(r => r.json());
      populateProgramFilter();
      renderTable();
    }
  }

  // Recompute seat availability live as boxes are checked
  courseList.addEventListener('change', () => {
    const selectedCourses = Array.from(courseList.querySelectorAll('input[type=checkbox]:checked'))
        .map(cb => Number(cb.value));
    renderCourseList(editingId, selectedCourses);
  });

  document.getElementById('addStudentBtn').addEventListener('click', () => openEditor(null));

  // Contact modal (unchanged - it's just a UI form, no database needed for it)
  const contactScrim = document.getElementById('contactScrim');
  const cName = document.getElementById('cName');
  const cEmail = document.getElementById('cEmail');
  const cReason = document.getElementById('cReason');

  function openContact(){
    contactScrim.classList.add('open');
    cName.focus();
  }
  function closeContact(){
    contactScrim.classList.remove('open');
  }
  document.getElementById('contactBtn').addEventListener('click', openContact);
  document.getElementById('navContact').addEventListener('click', openContact);
  document.getElementById('closeContact').addEventListener('click', closeContact);
  document.getElementById('cancelContact').addEventListener('click', closeContact);
  contactScrim.addEventListener('click', (e) => { if(e.target === contactScrim) closeContact(); });
  document.getElementById('submitContact').addEventListener('click', () => {
    const name = cName.value.trim();
    const email = cEmail.value.trim();
    if(!name || !email){
      alert('Please fill in your name and email.');
      return;
    }
    alert(`Thanks, ${name}! Your message regarding "${cReason.value}" has been noted. We'll reach out to ${email} shortly.`);
    cName.value = '';
    cEmail.value = '';
    cReason.selectedIndex = 0;
    closeContact();
  });
  document.getElementById('closeCard').addEventListener('click', closeEditor);
  document.getElementById('cancelBtn').addEventListener('click', closeEditor);
  document.getElementById('saveBtn').addEventListener('click', saveStudent);
  scrim.addEventListener('click', closeEditor);
  searchInput.addEventListener('input', renderTable);
  programFilter.addEventListener('change', renderTable);
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeEditor(); });

  // init - load everything from the backend when the page opens
  loadData();
