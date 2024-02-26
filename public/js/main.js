
let regForm = document.getElementById('registerForm');
if (regForm != null) {
    regForm.addEventListener('submit', register);
}

let lgForm = document.getElementById('loginForm');
if (lgForm != null) {
    lgForm.addEventListener('submit', login);
}

function register(e) {
    e.preventDefault();

    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let email = document.getElementById('registerEmail').value;
    let password = document.getElementById('registerPassword').value;
    let cPassword = document.getElementById('repeatPassword').value;

    fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email: email, password: password, c_password: cPassword })
    })
        .then((res) => res.json())
        .then((data) => {

            if (data['success']) {
                window.location.href = "http://127.0.0.1:8000/";
            }

        })
}



function login(e) {
    e.preventDefault();

    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;

    fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            window.sessionStorage.setItem('user', JSON.stringify(data));
            window.sessionStorage.setItem('access_token', data['token']);
            let role = data['role'];
            if (role === 'admin') window.location.href = "http://127.0.0.1:8000/dashboard";
            else if (role === 'student') window.location.href = "http://127.0.0.1:8000/student";
            else if (role === 'doctor') window.location.href = "http://127.0.0.1:8000/doctor";
            else if (role === 'assistant') window.location.href = "http://127.0.0.1:8000/teacher";
        })
}

// displaying username in the dashboard
function displayUserData() {
    // retrieve user data from session storage
    const userData = JSON.parse(window.sessionStorage.getItem('user'));

    // display user data in the profile page
    document.getElementById('showUsername').textContent = userData.first_name;
}

if (window.location.pathname !== '/' && window.location.pathname !== '/register') {
    displayUserData();
}

// Logout
let lgoBt = document.getElementById('logoutButton');
if (lgoBt !== null) {
    lgoBt.addEventListener('click', logout);
}

function logout(e) {
    e.preventDefault();
    const accessToken = window.sessionStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({})
    })
        .then((res) => res.json())
        .then((data) => {
            if (data['success']) {
                window.sessionStorage.removeItem('access_token');
                window.location.href = "http://127.0.0.1:8000/";

            }

        })
}

// retriving utilities
if (window.location.pathname == '/utilities') {

    window.addEventListener('load', loadUtilities);

    function loadUtilities(e) {
        e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/admin/utilities', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                let content = "";
                if (data.length > 0) {
                    content = "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>الأدوات المساعدة</h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#doctorModal'><i class='fas fa-download fa-sm text-white-50'></i> إضافة أداة جديدة</a></div><div class='card shadow mb-4'><div class='card-header py-3'></div><div class='card-body'><div class='table-responsive'><table class='table table-bordered' id='dataTable' width='100%' cellspacing='0'><thead><tr><th> الأسم</th><th>الكمية </th><th>الإجراء</th></tr></thead><tfoot><tr><th id='fuck'> الأسم</th><th>الكمية </th><th>الإجراء</th></tr></tfoot><tbody>";
                    for (let i = 0; i < data.length; i++) {
                        let item = "";

                        item = "<tr><td>" + data[i]['name'] + "</td><td>" + data[i]['count'] + "</td><td><a href = '#' class='d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm'data-toggle='modal' data-target='#Modal" + data[i]['id'] + "' >  تعديل</a > <button value='" + data[i]['id'] + "' class='btn btn-danger delete-btn delete-btn'>حذف</button> </td ></tr > ";

                        content += item;

                    }

                    content += "</tbody></table></div></div></div>";
                    for (let i = 0; i < data.length; i++) {
                        content += "<div class='modal fade' id='Modal" + data[i]['id'] + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header text-center'><h4 class='modal-title w-100 font-weight-bold'> تعديل</h4><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><form id='utilityForm' class='editForm'><div class='modal-body mx-3'><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><input type='text' id='name' class='form-control validate' value='" + data[i]['name'] + "' name='name'><label data-error='wrong' data-success='right' for='orangeForm-name'>الأسم </label></div><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><input type='number' id='count' class='form-control validate' value='" + data[i]['count'] + "' name='count'><label data-error='wrong' data-success='right' for='orangeForm-name'> الكمية</label></div></div><div class='modal-footer d-flex justify-content-center'><input type='hidden'value='" + data[i]['id'] + "' name='itemId'/><input type='submit' value='تعديل' class='btn btn-deep-orange'></div></form></div></div></div>";
                    }
                }
                else {
                    content += "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>الأدوات المساعدة</h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#doctorModal'><i class='fas fa-download fa-sm text-white-50'></i> إضافة أداة جديدة</a></div> <center><h2>لا يوجد بيانات لعرضها!</h2></center>"
                }
                document.getElementsByClassName('container-fluid')[0].innerHTML = content;

            })

    }

    // adding utility
    document.getElementById("utilityForm").addEventListener('submit', addUtility);

    function addUtility(e) {
        e.preventDefault();

        let name = document.getElementById('name').value;
        let count = document.getElementById('count').value;
        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/admin/utilities', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ name: name, count: count })
        })
            .then((res) => res.json())
            .then((data) => {

                location.reload();

            })
    }




    // Editing utility
    document.addEventListener('submit', event => {
        const form = event.target.closest('form');
        if (form && form.classList.contains('editForm')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const itemId = form.querySelector('input[name="itemId"]').value;
            const name = form.querySelector('input[name="name"]').value;
            const count = form.querySelector('input[name="count"]').value;


            fetch(`http://127.0.0.1:8000/api/admin/utilities/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ name: name, count: count })
            })
                .then((res) => res.json())
                .then((data) => {
                    location.reload();

                })
        }
    });


    // Delete utility
    document.addEventListener('click', event => {
        const btn = event.target.closest('button');
        if (btn && btn.classList.contains('delete-btn')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const itemId = btn.value;


            fetch(`http://127.0.0.1:8000/api/admin/utilities/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data['success']) {
                        location.reload();
                    }

                })
        }
    });


}


// retriving lectures
if (window.location.pathname == '/lectures') {

    window.addEventListener('load', loadLectures);
    window.addEventListener('load', loadDoctors);
    window.addEventListener('load', loadCourses);

    function loadLectures(e) {
        e.preventDefault();

        loadStg();
        loadUtilities();
        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/admin/lectures', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                let content = "";
                if (data.length > 0) {
                    content = "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>المحاضرات</h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#addModal'><i class='fas fa-download fa-sm text-white-50'></i> إضافة محاضرة جديدة </a></div><div class='card shadow mb-4'><div class='card-header py-3'></div><div class='card-body'><div class='table-responsive'><table class='table table-bordered' id='dataTable' width='100%' cellspacing='0'><thead><tr><th> المدرس </th><th>المقرر</th><th>نوع المحاضرة</th><th>مجموعات الطلاب</th><th>الأدوات المساعدة</th><th>الإجراء</th></tr></thead><tfoot><tr><th>الدكتور أو الأستاذ</th><th>المقرر</th><th>نوع المحاضرة</th><th>مجموعات الطلاب</th><th>الأدوات المساعدة</th><th>الإجراء</th></tr></tfoot><tbody>";
                    for (let i = 0; i < data.length; i++) {
                        let item = "";
                        item = "<tr><td>" + data[i].original.first_name + " " + data[i].original.last_name + "</td><td>" + data[i].original.course + "</td><td>" + (data[i].original.lecture_type ? "جلسة" : " محاضرة") + "</td><td>" + data[i].original.students_groups + "</td><td>" + data[i].original.utilities + "</td><td><a href = '#' id='addstg' class='d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm'data-toggle='modal' data-target='#Modal" + data[i].original.id + "' >اضافة مجموعة طلاب</a ></br><a href = '#' id='addUtility' class='m-2 d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm'data-toggle='modal' data-target='#ModalU" + data[i].original.id + "' >اضافة أداة مساعدة</a ></br><button value='" + data[i].original.id + "' class='btn btn-danger delete-btn delete-btn'>حذف المحاضرة</button> </td ></tr > ";

                        content += item;

                    }

                    content += "</tbody></table></div></div></div>";
                    const stgData = JSON.parse(window.sessionStorage.getItem('stg'));
                    let sz = stgData.length;
                    let stgoptions = '';
                    if (sz > 0) {
                        for (let i = 0; i < sz; i++) {
                            let item = "";
                            if (stgData[i]['year'] != null) {
                                let ans = stgData[i]['year'];
                                item += "السنة:" + ans;
                            }
                            if (stgData[i]['department'] != null) {
                                let ans = stgData[i]['department'];
                                item += " - القسم:" + ans;
                            }
                            if (stgData[i]['division'] != null) {
                                let ans = stgData[i]['division'];
                                item += " - الشعبة:" + ans;
                            }
                            if (stgData[i]['category'] != null) {
                                let ans = stgData[i]['category'];
                                item += " - الفئة:" + ans;
                            }
                            stgoptions += '<option value="' + stgData[i]['id'] + '">' + item + '</option>';
                        }

                    }


                    const utilitiesData = JSON.parse(window.sessionStorage.getItem('utilities'));
                    let utilitiesOptions = '';
                    if (utilitiesData.length > 0) {
                        for (let i = 0; i < utilitiesData.length; i++) {

                            utilitiesOptions += '<option value="' + utilitiesData[i]['id'] + '">' + utilitiesData[i]['name'] + '</option>';
                        }

                    }

                    for (let i = 0; i < data.length; i++) {

                        content += "<div class='modal fade' id='Modal" + data[i].original.id + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header text-center'><h4 class='modal-title w-100 font-weight-bold'>اضافة مجموعة طلاب</h4><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><form id='utilityForm' class='editForm'><div class='modal-body mx-3'>  <div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i>" + "<select class='stgSelect form-control validate'>" + stgoptions + "</select>" + "<label data-error='wrong' data-success='right' for='orangeForm-name'>مجموعات الطلاب</label></div></div><div class='modal-footer d-flex justify-content-center'><input type='hidden'value='" + data[i].original.id + "' name='itemId'/><input type='submit' value='اضافة' class='btn btn-deep-orange'></div></form></div></div></div>";

                        content += "<div class='modal fade' id='ModalU" + data[i].original.id + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header text-center'><h4 class='modal-title w-100 font-weight-bold'>اضافة أداة مساعدة</h4><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><form id='utilityForm' class='utilityForm'><div class='modal-body mx-3'>  <div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i>" + "<select class='utilitySelect form-control validate'>" + utilitiesOptions + "</select>" + "<label data-error='wrong' data-success='right' for='orangeForm-name'> الأدوات المساعدة</label></div></div><div class='modal-footer d-flex justify-content-center'><input type='hidden'value='" + data[i].original.id + "' name='itemId'/><input type='submit' value='اضافة' class='btn btn-deep-orange'></div></form></div></div></div>";
                    }

                }
                else {
                    content += "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'> المحاضرات</h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#addModal'><i class='fas fa-download fa-sm text-white-50'></i> إضافة محاضرة جديدة</a></div> <center><h2>لا يوجد بيانات لعرضها!</h2></center>"
                }
                document.getElementsByClassName('container-fluid')[0].innerHTML = content;

            })

    }

    // loading doctors
    function loadDoctors(e) {
        e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/admin/doctors', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                let sz = data.length;
                if (sz > 0) {
                    let content = '';
                    for (let i = 0; i < sz; i++) {
                        content += '<option value="' + data[i]['id'] + '">' + data[i]['first_name'] + ' ' + data[i]['last_name'] + '</option>';
                    }

                    document.getElementById('doctorSelect').innerHTML = content;
                    loadAssistants()
                }


            })
    }

    // loading assistants
    function loadAssistants() {
        // e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/admin/assistants', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                let sz = data.length;
                if (sz > 0) {
                    let content = '';
                    for (let i = 0; i < sz; i++) {
                        content += '<option value="' + data[i]['id'] + '">' + data[i]['first_name'] + ' ' + data[i]['last_name'] + '</option>';
                    }

                    document.getElementById('doctorSelect').innerHTML += content;
                }


            })
    }

    // lading courses
    function loadCourses(e) {
        e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/admin/courses', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                let sz = data.length;
                if (sz > 0) {
                    let content = '';
                    for (let i = 0; i < sz; i++) {
                        content += '<option value="' + data[i]['id'] + '">' + data[i]['name'] + '</option>';
                    }

                    document.getElementById('courseSelect').innerHTML = content;
                }


            })
    }

    // loading students groups
    function loadStg() {

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/admin/students_groups', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                window.sessionStorage.setItem('stg', JSON.stringify(data));

            })
    }

    function loadUtilities() {
        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/admin/utilities', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                window.sessionStorage.setItem('utilities', JSON.stringify(data));

            })
    }


    // adding lecture
    document.getElementById('addingLec').addEventListener('click', addLecture);

    function addLecture(e) {
        e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        let drId = document.getElementById('doctorSelect').value;
        let courseId = document.getElementById('courseSelect').value;
        let type = document.getElementById('typeSelect').value;

        fetch(`http://127.0.0.1:8000/api/admin/lectures`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ user_id: drId, course_id: courseId, lecture_type: type })
        })
            .then((res) => res.json())
            .then((data) => {
                location.reload();

            })

    }

    // adding students group to the lecture
    document.addEventListener('submit', event => {
        const form = event.target.closest('form');
        if (form && form.classList.contains('editForm')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const lectureId = form.querySelector('input[name="itemId"]').value;
            const studentsGroupId = form.querySelector('.stgSelect').value;

            fetch(`http://127.0.0.1:8000/api/admin/lectures_students_groups`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ lecture_id: lectureId, students_group_id: studentsGroupId })
            })
                .then((res) => res.json())
                .then((data) => {
                    location.reload();

                })
        }
    });

    // adding utility to the lecture
    document.addEventListener('submit', event => {
        const form = event.target.closest('form');
        if (form && form.classList.contains('utilityForm')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const lectureId = form.querySelector('input[name="itemId"]').value;
            const utilityId = form.querySelector('.utilitySelect').value;

            fetch(`http://127.0.0.1:8000/api/admin/utilities_lectures`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ lecture_id: lectureId, utility_id: utilityId })
            })
                .then((res) => res.json())
                .then((data) => {
                    location.reload();

                })
        }
    });

    //deleting lecture
    document.addEventListener('click', event => {
        const btn = event.target.closest('button');
        if (btn && btn.classList.contains('delete-btn')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const itemId = btn.value;


            fetch(`http://127.0.0.1:8000/api/admin/lectures/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data['success']) {
                        location.reload();
                    }

                })
        }
    });


}


// retriving times
if (window.location.pathname == '/available-times') {

    window.addEventListener('load', loadTimes);

    function loadTimes(e) {
        e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/admin/times', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                let content = "";
                if (data.length > 0) {
                    content = "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>الأوقات المتاحة</h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#addModal'><i class='fas fa-download fa-sm text-white-50'></i> اضافة وقت جديد </a></div><div class='card shadow mb-4'><div class='card-header py-3'></div><div class='card-body'><div class='table-responsive'><table class='table table-bordered' id='dataTable' width='100%' cellspacing='0'><thead><tr><th> اليوم </th><th>وقت البداية</th><th>وقت النهاية</th><th>الإجراء</th></tr></thead><tfoot><tr><th>اليوم</th><th>وقت البداية</th><th>وقت النهاية</th><th>الإجراء</th></tr></tfoot><tbody>";
                    for (let i = 0; i < data.length; i++) {
                        let item = "";
                        let day = "";
                        switch (data[i]['day']) {
                            case 1: day = "السبت"; break;
                            case 2: day = "الأحد"; break;
                            case 3: day = "الأثنين"; break;
                            case 4: day = "الثلاثاء"; break;
                            case 5: day = "الأربعاء"; break;
                            case 6: day = "الخميس"; break;
                            default: day = "worng val: " + data[i]['day'];
                        }
                        item = "<tr><td>" + day + "</td><td>" + data[i]['start_time'] + "</td><td>" + data[i]['end_time'] + "</td><td><a href = '#' id='addstg' class='m-2 d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm'data-toggle='modal' data-target='#Modal" + data[i]['id'] + "' >تعديل</a ><button value='" + data[i]['id'] + "' class='btn btn-danger delete-btn delete-btn'>حذف </button> </td ></tr > ";

                        content += item;

                    }

                    content += "</tbody></table></div></div></div>";


                    for (let i = 0; i < data.length; i++) {
                        content += "<div class='modal fade' id='Modal" + data[i]['id'] + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header text-center'><h4 class='modal-title w-100 font-weight-bold'> تعديل</h4><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><form id='utilityForm' class='editForm'><div class='modal-body mx-3'><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><select id='editDaySelect'><option value='1'" + (data[i]['day'] === 1 ? 'selected' : '') + ">السبت</option><option value='2'" + (data[i]['day'] === 2 ? 'selected' : '') + ">الأحد</option><option value='3' " + (data[i]['day'] === 3 ? 'selected' : '') + ">الأثنين</option><option value='4' " + (data[i]['day'] === 4 ? 'selected' : '') + ">الثلاثاء</option><option value='5' " + (data[i]['day'] === 5 ? 'selected' : '') + ">الأربعاء</option><option value='6' " + (data[i]['day'] === 6 ? 'selected' : '') + ">الخميس</option></select><label data-error='wrong' data-success='right' for='orangeForm-name'>اليوم </label></div><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><input type='text' id='count' class='form-control validate' value='" + data[i]['start_time'] + "' name='editStart'><label data-error='wrong' data-success='right' for='orangeForm-name'> وقت البداية</label></div><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><input type='text' id='count' class='form-control validate' value='" + data[i]['end_time'] + "' name='editEnd'><label data-error='wrong' data-success='right' for='orangeForm-name'> وقت النهاية</label></div></div><div class='modal-footer d-flex justify-content-center'><input type='hidden'value='" + data[i]['id'] + "' name='itemId'/><input type='submit' value='تعديل' class='btn btn-deep-orange'></div></form></div></div></div>";
                    }

                }
                else {
                    content += "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>الأوقات المتاحة</h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#addModal'><i class='fas fa-download fa-sm text-white-50'></i>  اضافة وقت جديد </a></div> <center><h2>لا يوجد بيانات لعرضها!</h2></center>"
                }
                document.getElementsByClassName('container-fluid')[0].innerHTML = content;

            })

    }

    // adding time
    document.getElementById('addingtime').addEventListener('click', addTime);

    function addTime(e) {
        e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        let day = document.getElementById('daySelect').value;
        let startTime = document.getElementById('startTime').value;
        let endTime = document.getElementById('endTime').value;

        fetch(`http://127.0.0.1:8000/api/admin/times`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ day: day, start_time: startTime, end_time: endTime })
        })
            .then((res) => res.json())
            .then((data) => {
                location.reload();

            })

    }


    // Editing time
    document.addEventListener('submit', event => {
        const form = event.target.closest('form');
        if (form && form.classList.contains('editForm')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const itemId = form.querySelector('input[name="itemId"]').value;
            const day = form.querySelector('#editDaySelect').value;
            const startTime = form.querySelector('input[name="editStart"]').value;
            const endTime = form.querySelector('input[name="editEnd"]').value;


            fetch(`http://127.0.0.1:8000/api/admin/times/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ day: day, start_time: startTime, end_time: endTime })
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data['success'])
                        location.reload();

                })
        }
    });

    //deleting time
    document.addEventListener('click', event => {
        const btn = event.target.closest('button');
        if (btn && btn.classList.contains('delete-btn')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const itemId = btn.value;


            fetch(`http://127.0.0.1:8000/api/admin/times/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data['success']) {
                        location.reload();
                    }

                })
        }
    });

}


// retriving classrooms
if (window.location.pathname == '/classrooms') {


    window.addEventListener('load', loadClassrooms);

    function loadClassrooms(e) {
        e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/admin/classrooms', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                let content = "";
                if (data.length > 0) {
                    content = "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>القاعات الدراسية</h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#addModal'><i class='fas fa-download fa-sm text-white-50'></i> اضافة قاعة جديدة </a></div><div class='card shadow mb-4'><div class='card-header py-3'></div><div class='card-body'><div class='table-responsive'><table class='table table-bordered' id='dataTable' width='100%' cellspacing='0'><thead><tr><th> الأسم </th><th>النوع</th><th> السعة</th><th>قابلية تركيب جهاز عرض</th><th>الإجراء</th></tr></thead><tfoot><tr><th> الأسم </th><th>النوع</th><th> السعة</th><th>قابلية تركيب جهاز عرض</th><th>الإجراء</th></tr></tfoot><tbody>";
                    for (let i = 0; i < data.length; i++) {
                        let item = "";
                        let type = "";
                        switch (data[i]['type']) {
                            case 'lecture': type = "نظري"; break;
                            case 'session': type = "عملي"; break;
                            case 'both': type = "نظري و عملي"; break;
                            default: type = data[i]['type'];
                        }
                        item = "<tr><td>" + data[i]['name'] + "</td><td>" + type + "</td><td>" + (data[i]['capacity'] ? data[i]['capacity'] : '/') + "</td><td>" + (data[i]['datashow'] ? 'نعم' : 'لا') + "</td><td><a href = '#' id='addstg' class='m-2 d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm'data-toggle='modal' data-target='#Modal" + data[i]['id'] + "' >تعديل</a ><button value='" + data[i]['id'] + "' class='btn btn-danger delete-btn delete-btn'>حذف </button> </td ></tr > ";

                        content += item;

                    }

                    content += "</tbody></table></div></div></div>";


                    for (let i = 0; i < data.length; i++) {
                        content += "<div class='modal fade' id='Modal" + data[i]['id'] + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header text-center'><h4 class='modal-title w-100 font-weight-bold'> تعديل</h4><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><form id='utilityForm' class='editForm'><div class='modal-body mx-3'><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><input type='text' value='" + data[i]['name'] + "' id='editName'/><label data-error='wrong' data-success='right' for='orangeForm-name'>الأسم </label></div><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><select id='editType'><option value='both'" + (data[i]['type'] === 'both' ? 'selected' : '') + ">نظري و عملي</option><option value='session'" + (data[i]['type'] === 'session' ? 'selected' : '') + ">عملي</option><option value='lecture'" + (data[i]['type'] === 'lecture' ? 'selected' : '') + " >نظري</option></select><label data-error='wrong' data-success='right' for='orangeForm-name'>النوع</label></div><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><input type='number' id='editCapacity' class='form-control validate' value='" + (data[i]['capacity'] ? data[i]['capacity'] : '') + "' name='editEnd'><label data-error='wrong' data-success='right' for='orangeForm-name'> السعة </label></div><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><select id='editDatashow'><option value='1'" + (data[i]['datashow'] ? 'selected' : '') + ">نعم</option><option value='0'" + (data[i]['datashow'] === 0 ? 'selected' : '') + ">لا</option></select><label data-error='wrong' data-success='right' for='orangeForm-name'> السعة </label></div></div><div class='modal-footer d-flex justify-content-center'><input type='hidden'value='" + data[i]['id'] + "' name='itemId'/><input type='submit' value='تعديل' class='btn btn-deep-orange'></div></form></div></div></div>";
                    }

                }
                else {
                    content += "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>القاعات الدراسية</h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#addModal'><i class='fas fa-download fa-sm text-white-50'></i>  اضافة قاعة جديدة </a></div> <center><h2>لا يوجد بيانات لعرضها!</h2></center>"
                }
                document.getElementsByClassName('container-fluid')[0].innerHTML = content;

            })

    }

    // adding classroom
    document.getElementById('addingClassroom').addEventListener('click', addClassroom);

    function addClassroom(e) {
        e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        let name = document.getElementById('className').value;
        let type = document.getElementById('classType').value;
        let capacity = document.getElementById('classCapacity').value;
        let datashow = document.getElementById('classDatashow').value;

        fetch(`http://127.0.0.1:8000/api/admin/classrooms`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ name: name, type: type, capacity: capacity, datashow: datashow })
        })
            .then((res) => res.json())
            .then((data) => {
                location.reload();

            })

    }

    // Editing classroom
    document.addEventListener('submit', event => {
        const form = event.target.closest('form');
        if (form && form.classList.contains('editForm')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const itemId = form.querySelector('input[name="itemId"]').value;
            const name = form.querySelector('#editName').value;
            const type = form.querySelector('#editType').value;
            const capacity = form.querySelector('#editCapacity').value;
            const datashow = form.querySelector('#editDatashow').value;


            fetch(`http://127.0.0.1:8000/api/admin/classrooms/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ name: name, type: type, capacity: capacity, datashow: datashow })
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data['success'])
                        location.reload();

                })
        }
    });

    //deleting classroom
    document.addEventListener('click', event => {
        const btn = event.target.closest('button');
        if (btn && btn.classList.contains('delete-btn')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const itemId = btn.value;


            fetch(`http://127.0.0.1:8000/api/admin/classrooms/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data['success']) {
                        location.reload();
                    }

                })
        }
    });

}


// retriving students-groups
if (window.location.pathname == '/students-groups') {


    window.addEventListener('load', loadStudentsGroups);

    function loadStudentsGroups(e) {
        e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/admin/students_groups', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                let content = "";
                if (data.length > 0) {
                    content = "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'> مجموعات الطلاب</h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#addModal'><i class='fas fa-download fa-sm text-white-50'></i> اضافة مجموعة جديدة </a></div><div class='card shadow mb-4'><div class='card-header py-3'></div><div class='card-body'><div class='table-responsive'><table class='table table-bordered' id='dataTable' width='100%' cellspacing='0'><thead><tr><th> السنة </th><th>القسم</th><th> الشعبة</th><th>الفئة</th><th>العدد</th><th>الإجراء</th></tr></thead><tfoot><tr><th> السنة </th><th>القسم</th><th> الشعبة</th><th>الفئة</th><th>العدد</th><th>الإجراء</th></tr></tfoot><tbody>";
                    for (let i = 0; i < data.length; i++) {
                        let item = "";

                        item = "<tr><td>" + data[i]['year'] + "</td><td>" + (data[i]['deparment'] == null ? 'عام' : data[i]['deparment']) + "</td><td>" + (data[i]['division'] == null ? '/' : data[i]['division']) + "</td><td>" + (data[i]['category'] == null ? '/' : data[i]['category']) + "</td><td>" + (data[i]['size'] ? data[i]['size'] : '/') + "</td><td><a href = '#' id='addstg' class='m-2 d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm'data-toggle='modal' data-target='#Modal" + data[i]['id'] + "' >تعديل</a ><button value='" + data[i]['id'] + "' class='btn btn-danger delete-btn delete-btn'>حذف </button> </td ></tr > ";

                        content += item;

                    }

                    content += "</tbody></table></div></div></div>";


                    for (let i = 0; i < data.length; i++) {
                        content += "<div class='modal fade' id='Modal" + data[i]['id'] + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header text-center'><h4 class='modal-title w-100 font-weight-bold'> تعديل</h4><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><form id='utilityForm' class='editForm'><div class='modal-body mx-3'><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><input type='number' value='" + data[i]['year'] + "' id='editYear'/><label data-error='wrong' data-success='right' for='orangeForm-name'>السنة </label></div><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><select id='editDepartment'><option value='هندسة برمجيات' " + (data[i]['department'] === "هندسة برمجيات" ? 'selected' : '') + ">هندسة برمجيات</option><option value='شبكات' " + (data[i]['department'] === "شبكات" ? 'selected' : '') + ">شبكات</option><option value='ذكاء صنعي' " + (data[i]['department'] === "ذكاء صنعي" ? 'selected' : '') + ">ذكاء صنعي</option><option value='عام' " + (data[i]['department'] === 'عام' ? 'selected' : '') + ">عام</option></select><label data-error='wrong' data-success='right' for='orangeForm-name'>القسم</label></div><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><input type='number' id='editDivision' class='form-control validate' value='" + (data[i]['division'] === null ? '' : data[i]['division']) + "' name='editEnd'><label data-error='wrong' data-success='right' for='orangeForm-name'> الشعبة </label></div><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><input type='number' id='editCategory' value='" + (data[i]['category'] === null ? '' : data[i]['category']) + "'<label data-error='wrong' data-success='right' for='orangeForm-name'> الفئة </label></div><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><input type='number' id='editSize' class='form-control validate' value='" + (data[i]['size'] ? data[i]['size'] : '') + "' name='editEnd'><label data-error='wrong' data-success='right' for='orangeForm-name'> العدد </label></div></div><div class='modal-footer d-flex justify-content-center'><input type='hidden'value='" + data[i]['id'] + "' name='itemId'/><input type='submit' value='تعديل' class='btn btn-deep-orange'></div></form></div></div></div>";
                    }

                }
                else {
                    content += "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>القاعات الدراسية</h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#addModal'><i class='fas fa-download fa-sm text-white-50'></i>  اضافة قاعة جديدة </a></div> <center><h2>لا يوجد بيانات لعرضها!</h2></center>"
                }
                document.getElementsByClassName('container-fluid')[0].innerHTML = content;

            })

    }


    // adding classroom
    document.getElementById('addingSTG').addEventListener('click', addStudentsGroup);

    function addStudentsGroup(e) {
        e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        let year = document.getElementById('stgYear').value;
        let department = document.getElementById('stgDepartment').value;
        let division = document.getElementById('stgDivision').value;
        if (division == 0) division = null;
        let category = document.getElementById('stgCategory').value;
        if (category == 0) category = null;
        let size = document.getElementById('stgSize').value;

        fetch(`http://127.0.0.1:8000/api/admin/students_groups`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ year: year, department: department, division: division, category: category, size: size })
        })
            .then((res) => res.json())
            .then((data) => {
                location.reload();

            })

    }

    // Editing classroom
    document.addEventListener('submit', event => {
        const form = event.target.closest('form');
        if (form && form.classList.contains('editForm')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const itemId = form.querySelector('input[name="itemId"]').value;
            const year = form.querySelector('#editYear').value;
            const department = form.querySelector('#editDepartment').value;
            const division = form.querySelector('#editDivision').value;
            const category = form.querySelector('#editCategory').value;
            const size = form.querySelector('#editSize').value;


            fetch(`http://127.0.0.1:8000/api/admin/students_groups/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ year: year, department: department, division: division, category: category, size: size })
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data['success'])
                        location.reload();

                })
        }
    });


    //deleting classroom
    document.addEventListener('click', event => {
        const btn = event.target.closest('button');
        if (btn && btn.classList.contains('delete-btn')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const itemId = btn.value;


            fetch(`http://127.0.0.1:8000/api/admin/students_groups/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data['success']) {
                        location.reload();
                    }

                })
        }
    });



}

// retriving teachers
if (window.location.pathname == '/teachers') {



    window.addEventListener('load', loadTeachers);

    function loadTeachers(e) {
        e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/admin/assistants', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                let content = "";
                if (data.length > 0) {
                    content = "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>الأساتذة</h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#addModal'><i class='fas fa-download fa-sm text-white-50'></i> اضافة أستاذ  </a></div><div class='card shadow mb-4'><div class='card-header py-3'></div><div class='card-body'><div class='table-responsive'><table class='table table-bordered' id='dataTable' width='100%' cellspacing='0'><thead><tr><th> الأسم الاول </th><th>الأسم الأخير</th><th>البريد الإلكتروني</th><th>الإجراء</th></tr></thead><tfoot><tr><th> الأسم الاول </th><th>الأسم الأخير</th><th>البريد الإلكتروني</th><th>الإجراء</th></tr></tfoot><tbody>";
                    for (let i = 0; i < data.length; i++) {
                        let item = "";

                        item = "<tr><td>" + data[i]['first_name'] + "</td><td>" + data[i]['last_name'] + "</td><td>" + data[i]['email'] + "</td><td><button value='" + data[i]['id'] + "' class='btn btn-danger delete-btn delete-btn'>حذف </button> </td ></tr > ";

                        content += item;

                    }

                    content += "</tbody></table></div></div></div>";




                }
                else {
                    content += "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>الأساتذة </h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#addModal'><i class='fas fa-download fa-sm text-white-50'></i>  اضافة أستاذ  </a></div> <center><h2>لا يوجد بيانات لعرضها!</h2></center>";
                }
                document.getElementsByClassName('container-fluid')[0].innerHTML = content;

            })

    }


    // adding teacher
    document.getElementById('addingAssistant').addEventListener('click', addStudentsGroup);

    function addStudentsGroup(e) {
        e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        let firstName = document.getElementById('tfn').value;
        let lastName = document.getElementById('tln').value;
        let email = document.getElementById('te').value;
        let password = document.getElementById('tp').value;


        fetch(`http://127.0.0.1:8000/api/admin/add_assistant`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, email: email, password: password })
        })
            .then((res) => res.json())
            .then((data) => {
                location.reload();

            })

    }


    //deleting teacher
    document.addEventListener('click', event => {
        const btn = event.target.closest('button');
        if (btn && btn.classList.contains('delete-btn')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const itemId = btn.value;


            fetch(`http://127.0.0.1:8000/api/admin/users/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data['success']) {
                        location.reload();
                    }

                })
        }
    });


}


// retriving doctors
if (window.location.pathname == '/doctors') {
    window.addEventListener('load', loadDoctors);

    function loadDoctors(e) {
        e.preventDefault();
        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/admin/doctors', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        })
            .then((res) => res.json())
            .then((data) => {
                let content = "";
                if (data.length > 0) {
                    content = "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>الدكاترة</h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#addModal'><i class='fas fa-download fa-sm text-white-50'></i> اضافة دكتور  </a></div><div class='card shadow mb-4'><div class='card-header py-3'></div><div class='card-body'><div class='table-responsive'><table class='table table-bordered' id='dataTable' width='100%' cellspacing='0'><thead><tr><th> الأسم الاول </th><th>الأسم الأخير</th><th>البريد الإلكتروني</th><th>الإجراء</th></tr></thead><tfoot><tr><th> الأسم الاول </th><th>الأسم الأخير</th><th>البريد الإلكتروني</th><th>الإجراء</th></tr></tfoot><tbody>";
                    for (let i = 0; i < data.length; i++) {
                        let item = "";
                        item = "<tr><td>" + data[i]['first_name'] + "</td><td>" + data[i]['last_name'] + "</td><td>" + data[i]['email'] + "</td><td><button value='" + data[i]['id'] + "' class='btn btn-danger delete-btn delete-btn'>حذف </button> </td ></tr > ";
                        content += item;
                    }

                    content += "</tbody></table></div></div></div>";
                }
                else {
                    content += "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>الدكاترة </h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#addModal'><i class='fas fa-download fa-sm text-white-50'></i>  اضافة دكتور  </a></div> <center><h2>لا يوجد بيانات لعرضها!</h2></center>";
                }
                document.getElementsByClassName('container-fluid')[0].innerHTML = content;
            })
    }

    // adding teacher
    document.getElementById('addingAssistant').addEventListener('click', addStudentsGroup);

    function addStudentsGroup(e) {
        e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        let firstName = document.getElementById('tfn').value;
        let lastName = document.getElementById('tln').value;
        let email = document.getElementById('te').value;
        let password = document.getElementById('tp').value;


        fetch(`http://127.0.0.1:8000/api/admin/add_doctor`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, email: email, password: password })
        })
            .then((res) => res.json())
            .then((data) => {
                location.reload();

            })

    }


    //deleting teacher
    document.addEventListener('click', event => {
        const btn = event.target.closest('button');
        if (btn && btn.classList.contains('delete-btn')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const itemId = btn.value;


            fetch(`http://127.0.0.1:8000/api/admin/users/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data['success']) {
                        location.reload();
                    }

                })
        }
    });


}



// retriving doctors
if (window.location.pathname == '/courses') {
    window.addEventListener('load', loadCourses);

    function loadCourses(e) {
        e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/admin/courses', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                let content = "";
                if (data.length > 0) {
                    content = "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>المقررات</h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#addModal'><i class='fas fa-download fa-sm text-white-50'></i> اضافة مقرر جديد  </a></div><div class='card shadow mb-4'><div class='card-header py-3'></div><div class='card-body'><div class='table-responsive'><table class='table table-bordered' id='dataTable' width='100%' cellspacing='0'><thead><tr><th>الأسم</th><th>السنة</th>><th>الإجراء</th></tr></thead><tfoot><tr><th>الأسم</th><th>السنة</th>><th>الإجراء</th></tr></tfoot><tbody>";
                    for (let i = 0; i < data.length; i++) {
                        let item = "";

                        item = "<tr><td>" + data[i]['name'] + "</td><td>" + data[i]['year'] + "</td><td><a href = '#' id='addstg' class='m-2 d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm'data-toggle='modal' data-target='#Modal" + data[i]['id'] + "' >تعديل</a ><button value='" + data[i]['id'] + "' class='btn btn-danger delete-btn delete-btn'>حذف </button> </td ></tr > ";

                        content += item;

                    }

                    content += "</tbody></table></div></div></div>";

                    for (let i = 0; i < data.length; i++) {
                        content += "<div class='modal fade' id='Modal" + data[i]['id'] + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header text-center'><h4 class='modal-title w-100 font-weight-bold'> تعديل</h4><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><form id='utilityForm' class='editForm'><div class='modal-body mx-3'><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><input type='text' value='" + data[i]['name'] + "' id='editName'/><label data-error='wrong' data-success='right' for='orangeForm-name'>الأسم </label></div><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><input type='number' id='editYear' class='form-control validate' min='1' value='" + data[i]['year'] + "' name='editEnd'><label data-error='wrong' data-success='right' for='orangeForm-name'> السنة </label></div></div><div class='modal-footer d-flex justify-content-center'><input type='hidden'value='" + data[i]['id'] + "' name='itemId'/><input type='submit' value='تعديل' class='btn btn-deep-orange'></div></form></div></div></div>";
                    }


                }
                else {
                    content += "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>المقررات </h1><a href='#' class='d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm'data-toggle='modal' data-target='#addModal'><i class='fas fa-download fa-sm text-white-50'></i>  اضافة مقرر جديد  </a></div> <center><h2>لا يوجد بيانات لعرضها!</h2></center>";
                }
                document.getElementsByClassName('container-fluid')[0].innerHTML = content;

            })

    }


    // adding course
    document.getElementById('addingCourse').addEventListener('click', addStudentsGroup);

    function addStudentsGroup(e) {
        e.preventDefault();

        const accessToken = window.sessionStorage.getItem('access_token');
        let name = document.getElementById('aName').value;
        let year = document.getElementById('aYear').value;


        fetch(`http://127.0.0.1:8000/api/admin/courses`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ name: name, year: year })
        })
            .then((res) => res.json())
            .then((data) => {
                location.reload();

            })

    }


    // Editing course
    document.addEventListener('submit', event => {
        const form = event.target.closest('form');
        if (form && form.classList.contains('editForm')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const itemId = form.querySelector('input[name="itemId"]').value;
            const name = form.querySelector('#editName').value;
            const year = form.querySelector('#editYear').value;


            fetch(`http://127.0.0.1:8000/api/admin/courses/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ name: name, year: year })
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data['success'])
                        location.reload();

                })
        }
    });


    //deleting course
    document.addEventListener('click', event => {
        const btn = event.target.closest('button');
        if (btn && btn.classList.contains('delete-btn')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const itemId = btn.value;


            fetch(`http://127.0.0.1:8000/api/admin/courses/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data['success']) {
                        location.reload();
                    }

                })
        }
    });




}


// doctor CRUD
if (window.location.pathname == '/doctor' || window.location.pathname == '/teacher' || window.location.pathname == '/student') {


    window.addEventListener('load', loadScheduledLectures);


    ////////////////////////////////////////////DATA//////////////////////////////////////////////////////
    let users = [];

    let courses = [];


    let coursesUsers = [];

    let classRooms = [];


    let lectures = [];


    let roles = [];

    let sg = [];
    let mainSg = [];

    let times = [];

    let timeTable = [];

    let uploads = [];
    let lsg = [];

    let utilities = [];

    let utilitiesLectures = [];
    /////////////////////////////////////////////////////DATA^////////////////////////////////////////////////////
    /////////////////////////////////////////////////////DATA^////////////////////////////////////////////////////
    /////////////////////////////////////////////////////DATA^///////////////////////////////////////////////////
    // JSON lengths:
    let timeCount = Object.keys(times).length;
    let classCount = Object.keys(classRooms).length;
    let lectureCount = Object.keys(lectures).length;
    let usersCount = Object.keys(users).length;
    let sgCount = Object.keys(sg).length;
    let lsgCount = Object.keys(lsg).length;
    let utilitiesLecturesCount = Object.keys(utilitiesLectures).length;
    let utilitiesCount = Object.keys(utilities).length;
    // Loading users
    function loadUsers() {

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/users', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                window.sessionStorage.setItem('users', JSON.stringify(data));
                users = data;
                usersCount = Object.keys(users).length;

            })

    }
    //Loading courses
    function loadCourses() {

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/courses', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                window.sessionStorage.setItem('courses', JSON.stringify(data));
                courses = data;

            })

    }

    //loading classooms
    function loadClassrooms() {

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/classrooms', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                window.sessionStorage.setItem('classrooms', JSON.stringify(data));

                classRooms = data;
                classCount = Object.keys(classRooms).length;

            })

    }

    //loading lectures
    function loadLectures() {

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/normal_lectures', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                window.sessionStorage.setItem('lectures', JSON.stringify(data));

                lectures = data;
                lectureCount = Object.keys(lectures).length;

            })

    }

    //loading students groups
    function loadSg() {

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/students_groups', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                window.sessionStorage.setItem('sg', JSON.stringify(data));
                sg = data;

                sgCount = Object.keys(sg).length;

            })

    }

    //loading lsg
    function loadLsg() {

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/lectures_students_groups', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                window.sessionStorage.setItem('lsg', JSON.stringify(data));

                lsg = data;
                lsgCount = Object.keys(lsg).length;

            })

    }


    //loading times
    function loadTimes() {

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/times', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                window.sessionStorage.setItem('times', JSON.stringify(data));

                times = data;
                timeCount = Object.keys(times).length;

            })

    }

    //loading utilitis
    function loadUtilities() {

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/utilities', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                window.sessionStorage.setItem('utilities', JSON.stringify(data));

                utilities = data;
                utilitiesCount = Object.keys(utilities).length;
            })

    }

    //loading utilitis_lectures
    function loadUtilitiesLectures() {

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/utilities_lectures', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                window.sessionStorage.setItem('utilities_lectures', JSON.stringify(data));
                utilitiesLectures = data;
                utilitiesLecturesCount = Object.keys(utilitiesLectures).length;

            })

    }


    function loadScheduledLectures(e) {
        e.preventDefault();
        loadUsers();
        loadCourses();
        loadClassrooms();
        loadLectures();
        loadSg();
        loadLsg();
        loadTimes();
        loadUtilities();
        loadUtilitiesLectures();

        const accessToken = window.sessionStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/api/scheduled_lectures', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                let content = "";
                let mainLectures = [];
                let XYZsz = data.length;
                let mainsz = mainSg.length;
                let lsgsz = lsgCount;

                if (data.length > 0) {

                    displayTimetable(data)

                }
                else {
                    content = "<div class='text-center'><p class='lead text-gray-800 mb-5'>لا يوجد برنامج دوام محفوظ</p><p class='text-gray-500 mb-0'>يبدو أن الأدمن لم يقم بتوليد برنامج دوام بعد</p></div>"
                    document.getElementsByClassName('container-fluid')[0].innerHTML = content;
                    setVal()

                }



            })


    }

    function setVal() {

        users = JSON.parse(window.sessionStorage.getItem('users'));
        usersCount = Object.keys(users).length;

        courses = JSON.parse(window.sessionStorage.getItem('courses'));
        classRooms = JSON.parse(window.sessionStorage.getItem('classrooms'));
        classCount = Object.keys(classRooms).length;

        lectures = JSON.parse(window.sessionStorage.getItem('lectures'));
        lectureCount = Object.keys(lectures).length;
        lecs = lectureCount;

        sg = JSON.parse(window.sessionStorage.getItem('sg'));
        let sz = sg.length;
        for (let i = 0; i < sz; i++) {
            if (sg[i]['main']) mainSg.push(sg[i]);
        }
        sgCount = Object.keys(sg).length

        lsg = JSON.parse(window.sessionStorage.getItem('lsg'));
        lsgCount = Object.keys(lsg).length;

        times = JSON.parse(window.sessionStorage.getItem('times'));
        timeCount = Object.keys(times).length;

        utilities = JSON.parse(window.sessionStorage.getItem('utilities'));
        utilitiesCount = Object.keys(utilities).length;

        utilitiesLectures = JSON.parse(window.sessionStorage.getItem('utilities_lectures'));
        utilitiesLecturesCount = Object.keys(utilitiesLectures).length;

    }


    function displayTimetable(bestIndividual) {
        setVal()
        let XYZsz = bestIndividual.length;
        let mainsz = mainSg.length;
        let lsgsz = lsgCount;
        console.log(bestIndividual);


        if (XYZsz > 0) {


            bestIndividual.sort((a, b) => {

                const timeA = times.find(t => t.id === a['time_id']);
                const timeB = times.find(t => t.id === b['time_id']);
                if (!timeA || !timeB) return 0;
                if (timeA.day === timeB.day) {
                    return timeA.start_time.localeCompare(timeB.start_time);
                }

                return timeA.day - timeB.day;
            });



            let content = "";
            // accuracy = Math.floor(accuracy - Math.random() * 2);
            content = "<!-- Page Heading --><div class='d-sm-flex align-items-center justify-content-between mb-4'><h2> البرنامج الحالي</h2></div>";

            for (let x in mainSg) {
                let year = "";
                switch (mainSg[x]['year']) {
                    case 1: year = "الأولى"; break;
                    case 2: year = "الثانية"; break;
                    case 3: year = "الثالثة"; break;
                    case 4: year = "الرابعة"; break;
                    case 5: year = "الخامسة"; break;
                }
                content += "  <div class='card shadow mb-4'><div class='card-header py-3'><h6 class='m-0 font-weight-bold text-primary'><center>" + "السنة : " + year + " | القسم : " + mainSg[x]['department'] + (mainSg[x]['division'] ? " | الشعبة : " + mainSg[x]['division'] : " ") + "</center></h6></div ><div class='view card-body'><div class='wrapper table-responsive'><table class='table table-bordered'>";


                let time = {};
                content += "<thead></thead><tbody>";

                content += "<tr><td class='sticky-col first-col'>السبت</td>";
                for (let i = 0; i < XYZsz - 1; i++) {

                    for (let k = 0; k < lsgsz; k++) {
                        if (lsg[k]['lecture_id'] == bestIndividual[i]['lecture_id']) {
                            const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                            if (csg['year'] == mainSg[x]['year']) {
                                if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                    if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                        let lastTime = JSON.parse(JSON.stringify(time));
                                        time = times.find(obj => obj.id === bestIndividual[i]['time_id']);

                                        if (time['day'] === 1) {
                                            if (Object.keys(lastTime).length > 0) {

                                                if (time['id'] === lastTime['id']) {
                                                    const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                    const course = courses.find(obj => obj.id === lecture['course_id']);
                                                    const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                    const prof = users.find(obj => obj.id === lecture['user_id']);
                                                    content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                                }
                                                else {
                                                    const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                    const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                    const course = courses.find(obj => obj.id === lecture['course_id']);
                                                    const prof = users.find(obj => obj.id === lecture['user_id']);

                                                    content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                    content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                                }
                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }

                                        }
                                    }
                                }
                            }

                        }
                    }



                }
                time = {};
                content += "</tr><tr><td class='sticky-col first-col'>الأحد</td>";
                for (let i = 0; i < XYZsz - 1; i++) {

                    for (let k = 0; k < lsgsz; k++) {
                        if (lsg[k]['lecture_id'] == bestIndividual[i]['lecture_id']) {
                            const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                            if (csg['year'] == mainSg[x]['year']) {
                                if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                    if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                        let lastTime = JSON.parse(JSON.stringify(time));

                                        time = times.find(obj => obj.id === bestIndividual[i]['time_id']);

                                        if (time['day'] === 2) {
                                            if (Object.keys(lastTime).length > 0) {

                                                if (time['id'] === lastTime['id']) {
                                                    const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                    const course = courses.find(obj => obj.id === lecture['course_id']);
                                                    const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                    const prof = users.find(obj => obj.id === lecture['user_id']);

                                                    content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                                }
                                                else {
                                                    const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                    const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                    const course = courses.find(obj => obj.id === lecture['course_id']);
                                                    const prof = users.find(obj => obj.id === lecture['user_id']);

                                                    content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                    content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                                }
                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }

                                        }
                                    }
                                }
                            }

                        }
                    }



                }
                time = {};
                content += "</tr><tr><td class='sticky-col first-col'>الأثنين</td>";
                for (let i = 0; i < XYZsz - 1; i++) {

                    for (let k = 0; k < lsgsz; k++) {
                        if (lsg[k]['lecture_id'] == bestIndividual[i]['lecture_id']) {
                            const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                            if (csg['year'] == mainSg[x]['year']) {
                                if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                    if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                        let lastTime = JSON.parse(JSON.stringify(time));

                                        time = times.find(obj => obj.id === bestIndividual[i]['time_id']);

                                        if (time['day'] === 3) {
                                            if (Object.keys(lastTime).length > 0) {


                                                if (time['id'] === lastTime['id']) {
                                                    const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                    const course = courses.find(obj => obj.id === lecture['course_id']);
                                                    const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                    const prof = users.find(obj => obj.id === lecture['user_id']);

                                                    content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                                }
                                                else {
                                                    const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                    const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                    const course = courses.find(obj => obj.id === lecture['course_id']);
                                                    const prof = users.find(obj => obj.id === lecture['user_id']);

                                                    content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                    content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                                }
                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }

                                        }
                                    }
                                }
                            }

                        }
                    }



                }
                time = {};
                content += "</tr><tr><td class='sticky-col first-col'>الثلاثاء</td>";
                for (let i = 0; i < XYZsz - 1; i++) {

                    for (let k = 0; k < lsgsz; k++) {
                        if (lsg[k]['lecture_id'] == bestIndividual[i]['lecture_id']) {
                            const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                            if (csg['year'] == mainSg[x]['year']) {
                                if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                    if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                        let lastTime = JSON.parse(JSON.stringify(time));

                                        time = times.find(obj => obj.id === bestIndividual[i]['time_id']);

                                        if (time['day'] === 4) {
                                            if (Object.keys(lastTime).length > 0) {


                                                if (time['id'] === lastTime['id']) {
                                                    const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                    const course = courses.find(obj => obj.id === lecture['course_id']);
                                                    const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                    const prof = users.find(obj => obj.id === lecture['user_id']);

                                                    content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                                }
                                                else {
                                                    const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                    const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                    const course = courses.find(obj => obj.id === lecture['course_id']);
                                                    const prof = users.find(obj => obj.id === lecture['user_id']);

                                                    content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                    content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                                }
                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }

                                        }
                                    }
                                }
                            }

                        }
                    }



                }

                time = {};
                content += "</tr><tr><td class='sticky-col first-col'>الأربعاء</td>";
                for (let i = 0; i < XYZsz - 1; i++) {

                    for (let k = 0; k < lsgsz; k++) {
                        if (lsg[k]['lecture_id'] == bestIndividual[i]['lecture_id']) {
                            const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                            if (csg['year'] == mainSg[x]['year']) {
                                if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                    if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                        let lastTime = JSON.parse(JSON.stringify(time));

                                        time = times.find(obj => obj.id === bestIndividual[i]['time_id']);
                                        if (time['day'] === 5) {

                                            if (Object.keys(lastTime).length > 0) {


                                                if (time['id'] === lastTime['id']) {
                                                    const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                    const course = courses.find(obj => obj.id === lecture['course_id']);
                                                    const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                    const prof = users.find(obj => obj.id === lecture['user_id']);

                                                    content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                                }
                                                else {
                                                    const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                    const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                    const course = courses.find(obj => obj.id === lecture['course_id']);
                                                    const prof = users.find(obj => obj.id === lecture['user_id']);

                                                    content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                    content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                                }
                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }
                                        }


                                    }
                                }
                            }

                        }
                    }



                }
                time = {};
                content += "</tr><tr><td class='sticky-col first-col'>الخميس</td>";
                for (let i = 0; i < XYZsz - 1; i++) {

                    for (let k = 0; k < lsgsz; k++) {
                        if (lsg[k]['lecture_id'] == bestIndividual[i]['lecture_id']) {
                            const csg = sg.find(obj => obj.id === lsg[k]['students_group_id']);
                            if (csg['year'] == mainSg[x]['year']) {
                                if (csg['division'] === null || csg['division'] == mainSg[x]['division']) {
                                    if (csg['department'] === null || csg['department'] == mainSg[x]['department']) {
                                        let lastTime = JSON.parse(JSON.stringify(time));

                                        time = times.find(obj => obj.id === bestIndividual[i]['time_id']);

                                        if (time['day'] === 6) {
                                            if (Object.keys(lastTime).length > 0) {


                                                if (time['id'] === lastTime['id']) {
                                                    const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                    const course = courses.find(obj => obj.id === lecture['course_id']);
                                                    const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                    const prof = users.find(obj => obj.id === lecture['user_id']);

                                                    content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                                }
                                                else {
                                                    const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                    const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                    const course = courses.find(obj => obj.id === lecture['course_id']);
                                                    const prof = users.find(obj => obj.id === lecture['user_id']);

                                                    content += "</td><td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                    content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                                }
                                            }
                                            else {
                                                const classroom = classRooms.find(obj => obj.id === bestIndividual[i]['classroom_id']);
                                                const lecture = lectures.find(obj => obj.id === bestIndividual[i]['lecture_id']);
                                                const course = courses.find(obj => obj.id === lecture['course_id']);
                                                const prof = users.find(obj => obj.id === lecture['user_id']);

                                                content += "<td><center><span class='text-primary'>" + time['start_time'] + "-" + time['end_time'] + "</span></center><br>";
                                                content += course['name'] + "-" + (lecture['lecture_type'] ? 'جلسة' : 'محاضرة') + "-" + prof['first_name'] + " " + prof['last_name'] + "-" + classroom['name'] + "" + (csg['category'] ? "-ف" + csg['category'] + "" : "") + "</br>";

                                            }

                                        }
                                    }
                                }
                            }

                        }
                    }



                }
                content += "</tbody></table></div></div></div>";

            }

            document.getElementsByClassName('container-fluid')[0].innerHTML = content;




        }
    }
}

if (window.location.pathname == '/bestTimes') {
    loadTimes();

    window.addEventListener('load', loadBestTimes);

    document.addEventListener('submit', event => {
        const form = event.target.closest('form');
        if (form && form.classList.contains('editForm')) {
            event.preventDefault();
            const accessToken = window.sessionStorage.getItem('access_token');
            // Get the item ID from the hidden input
            const timeId = form.querySelector('#editDaySelect').value;
            const bestTimeNum = form.querySelector('input[name="itemId"]').value;
            console.log(bestTimeNum);
            const userData = JSON.parse(window.sessionStorage.getItem('user'));
            const userId = userData.id;

            fetch(`http://127.0.0.1:8000/api/edit_best_time/${userId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ time_id: timeId, best_time_num: bestTimeNum })
            })
                .then((res) => res.json())
                .then((data) => {
                    location.reload();

                })
        }
    });



    function loadBestTimes(e) {
        e.preventDefault();

        const userData = JSON.parse(window.sessionStorage.getItem('user'));
        const userId = userData.id;
        // console.log(userData)
        const accessToken = window.sessionStorage.getItem('access_token');
        fetch(`http://127.0.0.1:8000/api/best_times/${userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

        })
            .then((res) => res.json())
            .then((data) => {
                let content = "";
                content = "<div class='d-sm-flex align-items-center justify-content-between mb-4'><h1 class='h3 mb-0 text-gray-800'>الأوقات المفضلة</h1></div><div class='card shadow mb-4'><div class='card-header py-3'></div><div class='card-body'><div class='table-responsive'><table class='table table-bordered' id='dataTable' width='100%' cellspacing='0'><thead><tr><th> رقم الرغبة </th><th> اليوم </th><th>وقت البداية</th><th>وقت النهاية</th><th>الإجراء</th></tr></thead><tfoot><tr><th> رقم الرغبة </th><th>اليوم</th><th>وقت البداية</th><th>وقت النهاية</th><th>الإجراء</th></tr></tfoot><tbody>";

                content += ""
                let bestTimeId = [data.first_best_time_id, data.second_best_time_id, data.third_best_time_id];
                for (let i = 0; i < 3; i++) {
                    let time = times.find(obj => obj.id === bestTimeId[i]);

                    let item = "";
                    let day = "";
                    let name = "";
                    if (bestTimeId[i] == null) day = '/';
                    else {
                        switch (time['day']) {
                            case 1: day = "السبت"; break;
                            case 2: day = "الأحد"; break;
                            case 3: day = "الأثنين"; break;
                            case 4: day = "الثلاثاء"; break;
                            case 5: day = "الأربعاء"; break;
                            case 6: day = "الخميس"; break;
                            default: day = "/ ";
                        }
                    }
                    switch (i) {
                        case 0: name = "الرغبة الأولى"; break;
                        case 1: name = "الرغبة الثانية"; break;
                        case 2: name = "الرغبة الثالثة"; break;
                    }
                    item = "<tr><td>" + name + "</td><td>" + day + "</td><td>" + (bestTimeId[i] == null ? '/' : time['start_time']) + "</td><td>" + (bestTimeId[i] == null ? '/' : time['end_time']) + "</td><td><a href = '#' id='addstg' class='m-2 d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm'data-toggle='modal' data-target='#Modal" + i + "' >تعديل</a></td ></tr > ";

                    content += item;

                }

                content += "</tbody></table></div></div></div>";


                for (let i = 0; i < 3; i++) {
                    if (bestTimeId[i] == null) {
                        console.log('k');
                        content += "<div class='modal fade' id='Modal" + i + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header text-center'><h4 class='modal-title w-100 font-weight-bold'> تعديل</h4><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><form id='utilityForm' class='editForm'><div class='modal-body mx-3'><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><select id='editDaySelect'><option value='1' selected>/</option>";
                    }
                    else {
                        let time = times.find(obj => obj.id === bestTimeId[i]);
                        let day = "";
                        switch (time['day']) {
                            case 1: day = "السبت"; break;
                            case 2: day = "الأحد"; break;
                            case 3: day = "الأثنين"; break;
                            case 4: day = "الثلاثاء"; break;
                            case 5: day = "الأربعاء"; break;
                            case 6: day = "الخميس"; break;
                        }
                        let timeFormat = day + " (" + time['start_time'] + " - " + time['end_time'] + ")";

                        content += "<div class='modal fade' id='Modal" + i + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header text-center'><h4 class='modal-title w-100 font-weight-bold'> تعديل</h4><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><form id='utilityForm' class='editForm'><div class='modal-body mx-3'><div class='md-form mb-1'><i class='fas fa-user prefix grey-text'></i><select id='editDaySelect'><option value='" + time['id'] + "' selected>" + timeFormat + "</option>";


                    }

                    for (let j = 0; j < timeCount; j++) {
                        if (bestTimeId[i] != null || bestTimeId[i] != times[j]['id']) {
                            let day = "";
                            switch (times[j]['day']) {
                                case 1: day = "السبت"; break;
                                case 2: day = "الأحد"; break;
                                case 3: day = "الأثنين"; break;
                                case 4: day = "الثلاثاء"; break;
                                case 5: day = "الأربعاء"; break;
                                case 6: day = "الخميس"; break;
                                default: day = "/ ";
                            }

                            let timeFormat = day + " (" + times[j]['start_time'] + " - " + times[j]['end_time'] + ")";

                            content += "<option value='" + times[j]['id'] + "' >" + timeFormat + "</option>";
                        }
                    }


                    content += "</select><label data-error='wrong' data-success='right' for='orangeForm-name'>الوقت </label><br></div><input type='hidden'value='" + i + "' name='itemId'/><center><input type='submit' value='تعديل' class='btn btn-deep-orange'></center></div></form></div></div></div>";
                }


                document.getElementsByClassName('container-fluid')[0].innerHTML = content;

            })



    }
}
