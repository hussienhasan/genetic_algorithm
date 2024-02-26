<!DOCTYPE html>
<html dir="rtl">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>أسم الموقع - المقررات</title>

    <!-- Custom fonts for this template -->
    <link href="{{asset('vendor/fontawesome-free/css/all.min.css')}}" rel="stylesheet" type="text/css">
    

    <!-- Custom styles for this template -->
    <link href="{{asset('css/sb-admin-2.min.css')}}" rel="stylesheet">

    <!-- Custom styles for this page -->
    <link href="{{asset('vendor/datatables/dataTables.bootstrap4.min.css')}}" rel="stylesheet">
    <link href="{{asset('css/style.css')}}" rel="stylesheet">


</head>

<body id="page-top">

    <!-- Page Wrapper -->
    <div id="wrapper">

        <!-- Sidebar -->
        <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar" dir="rtl">

            <!-- Sidebar - Brand -->
            <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                <div class="sidebar-brand-icon rotate-n-15">
                    <i class="fas fa-laugh-wink"> </i>
                </div>
                <div class="sidebar-brand-text nav-item"> اسم الموقع</div>
            </a>

            <!-- Divider -->
            <hr class="sidebar-divider my-0 nav-item">

               
            <!-- Nav Item - Dashboard -->
      <li class="nav-item  ">
        <a class="nav-link" href="{{ route('admin.dashboard')}}">
          <i class="fas fa-fw fa-tachometer-alt"></i>
          <span>لوحة التحكم</span>
        </a>
      </li>

      <!-- Divider -->
      <hr class="sidebar-divider nav-item">

      <!-- Heading -->
      <div class="sidebar-heading nav-item style=" text-align: center;">
        الإعدادات
      </div>

      <!-- Nav Item - Doctors -->
      <li class="nav-item">
        <a class="nav-link " href="{{ route('admin.doctors')}}">
          <i class="fas fa-fw fa-cog"></i>
          <span>الدكاترة</span>
        </a>
      </li>

      <!-- Nav Item - Teachers -->
      <li class="nav-item">
        <a class="nav-link " href="{{ route('admin.teachers')}}">
          <i class="fas fa-fw fa-cog"></i>
          <span>الأساتذة</span>
        </a>
      </li>

      <!-- Nav Item - Students groups -->
      <li class="nav-item">
        <a class="nav-link " href="{{ route('admin.students-groups')}}">
          <i class="fas fa-fw fa-cog"></i>
          <span>مجموعات الطلاب</span>
        </a>
      </li>

      <!-- Nav Item - courses  -->
<li class="nav-item active">
        <a class="nav-link " href="{{ route('admin.courses')}}">
          <i class="fas fa-fw fa-cog"></i>
          <span>المقررات</span>
        </a>
      </li>

      <!-- Nav Item - Classrooms -->
      <li class="nav-item ">
        <a class="nav-link " href="{{ route('admin.classrooms')}}">
          <i class="fas fa-fw fa-cog"></i>
          <span>القاعات الدراسية</span>
        </a>
      </li>

            <!-- Nav Item - Available times -->
            <li class="nav-item ">
                <a class="nav-link " href="{{ route('admin.available-times')}}">
                    <i class="fas fa-fw fa-cog"></i>
                    <span>الأوقات المتاحة </span>
                </a>
            </li>

           <!-- Nav Item - Scheduled lectures -->
      <li class="nav-item">
        <a class="nav-link " href="{{ route('admin.lectures')}}">
          <i class="fas fa-fw fa-cog"></i>
          <span>المحاضرات </span>
        </a>
      </li>

      <!-- Nav Item - utiities  -->
      <li class="nav-item">
        <a class="nav-link " href="{{ route('admin.utilities')}}">
          <i class="fas fa-fw fa-cog"></i>
          <span> الأدوات المساعدة</span>
        </a>
      </li>

            <!-- Divider -->
            <hr class="sidebar-divider d-none d-md-block">

            <!-- Sidebar Toggler (Sidebar) -->
            <div class="text-center d-none d-md-inline">
                <button class="rounded-circle border-0" id="sidebarToggle"></button>
            </div>

        </ul>
        <!-- End of Sidebar -->

        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">

            <!-- Main Content -->
            <div id="content">

                <!-- Topbar -->
                <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                    <!-- Sidebar Toggle (Topbar) -->
                    <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                        <i class="fa fa-bars"></i>
                    </button>



                    <!-- Topbar Navbar -->
                    <ul class="navbar-nav ml-auto">


                        <div class="topbar-divider d-none d-sm-block"></div>

                        <!-- Nav Item - User Information -->
                        <li class="nav-item dropdown no-arrow">
                            <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="mr-2 d-none d-lg-inline text-gray-600 small" id="showUsername"> </span>

                            </a>
                            <!-- Dropdown - User Information -->
                            <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                aria-labelledby="userDropdown">

                                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                    <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    تسجيل الخروج
                                </a>
                            </div>
                        </li>

                    </ul>

                </nav>
                <!-- End of Topbar -->

                <!-- Begin Page Content -->
                <div class="container-fluid">

                   <!-- Page Heading -->
                   <div class="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 class="h3 mb-0 text-gray-800"> المقررات</h1>
                        <a href="#" class="d-none d-sm-inline-block btn btn-lg btn-primary shadow-sm"
                            data-toggle="modal" data-target="#addModal"><i
                                class="fas fa-download fa-sm text-white-50"></i>اضافة مقرر جديد</a>

                    </div>

                    <center><h2>يتم التحميل...<br>الرجاء الأنتظار</h2></center>
                </div>
                <!-- /.container-fluid -->

            </div>
            <!-- End of Main Content -->

            <!-- Footer -->
            <footer class="sticky-footer bg-white">
                <div class="container my-auto">
                    <div class="copyright text-center my-auto">
                        <span>جميع الحقوق محفوظة &copy; أسم الموقع 2023</span>
                    </div>
                </div>
            </footer>
            <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#page-top">
        <i class="fas fa-angle-up"></i>
    </a>

    <!-- Logout Modal-->
    <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">هل أنت مستعد للمغادرة؟</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">أختر "تسجيل الخروج" في حال كنت مستعد لتنهي جلستك الحالية</div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">إلغاء</button>
                    <a class="btn btn-primary" href="login.html">تسجيل الخروج</a>
                </div>
            </div>
        </div>
    </div>


    <!-- Add doctor Modal-->
    <div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header text-center">
                    <h4 class="modal-title w-100 font-weight-bold">أضف مقرر</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body mx-3">
                    <div class="md-form mb-1">
                        <i class="fas fa-user prefix grey-text"></i>
                        <input type="text" id="aName" class="form-control validate">
                        <label data-error="wrong" data-success="right" for="orangeForm-name">الأسم</label>
                    </div>
                    <div class="md-form mb-1">
                        <i class="fas fa-user prefix grey-text"></i>
                        <input type="number" min="1"  id="aYear" class="form-control validate">
                        <label data-error="wrong" data-success="right" for="orangeForm-name">السنة</label>
                    </div>

                </div>
                <div class="modal-footer d-flex justify-content-center">
                    <button class="btn btn-deep-orange" id="addingCourse">إضافة</button>
                </div>
            </div>
        </div>
    </div>


    <!-- Bootstrap core JavaScript-->
    <script src="{{asset('vendor/jquery/jquery.min.js')}}"></script>
    <script src="{{asset('vendor/bootstrap/js/bootstrap.bundle.min.js')}}"></script>

    <!-- Core plugin JavaScript-->
    <script src="{{asset('vendor/jquery-easing/jquery.easing.min.js')}}"></script>

    <!-- Custom scripts for all pages-->
    <script src="{{asset('js/sb-admin-2.min.js')}}"></script>

    <!-- Page level plugins -->
    <script src="{{asset('vendor/datatables/jquery.dataTables.min.js')}}"></script>
    <script src="{{asset('vendor/datatables/jquery.dataTables.js')}}"></script>
    <script src="{{asset('vendor/datatables/dataTables.bootstrap4.min.js')}}"></script>

    <!-- Page level custom scripts -->
    <script src="{{asset('js/demo/datatables-demo.js')}}"></script>
    <script src="{{asset('js/main.js')}}"></script>


</body>

</html>