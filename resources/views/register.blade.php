<!DOCTYPE html>
<html>

<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">

  <title>أسم الموقع - إنشاء حساب</title>

  <!-- Custom fonts for this template-->
  <link href="{{asset('vendor/fontawesome-free/css/all.min.css')}}" rel="stylesheet" type="text/css">
  

  <!-- Custom styles for this template-->
  <link href="{{asset('css/sb-admin-2.min.css')}}" rel="stylesheet">

</head>

<body class="bg-gradient-primary">

  <div class="container">

    <div class="card o-hidden border-0 shadow-lg my-5">
      <div class="card-body p-0">
        <!-- Nested Row within Card Body -->
        <div class="row">
          <div class="col-lg-5 d-none d-lg-block bg-register-image"></div>
          <div class="col-lg-7">
            <div class="p-5">
              <div class="text-center">
                <h1 class="h4 text-gray-900 mb-4"> إنشاء حساب!</h1>
              </div>
              <form class="user" id="registerForm">
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <input type="text" class="form-control form-control-user" id="firstName"
                      placeholder="الأسم الأول">
                  </div>
                  <div class="col-sm-6">
                    <input type="text" class="form-control form-control-user" id="lastName"
                      placeholder="الأسم الأخير">
                  </div>
                </div>
                <div class="form-group">
                  <input type="email" class="form-control form-control-user" id="registerEmail"
                    placeholder="عنوان البريد الإلكتروني">
                </div>
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <input type="password" class="form-control form-control-user" id="registerPassword"
                      placeholder="كلمة المرور">
                  </div>
                  <div class="col-sm-6">
                    <input type="password" class="form-control form-control-user" id="repeatPassword"
                      placeholder="تأكيد كلمة المرور">
                  </div>
                </div>
                <input type="submit" value="إنشاء حساب" class="btn btn-primary btn-user btn-block">
              </form>
              <hr>
              <div class="text-center">
                <a class="small" href="{{ route('login')}}">هل لديك حساب؟ قم بتسجيل الدخول!</a>
              </div>
            </div>
          </div>
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
  
  <script src="{{asset('js/main.js')}}"></script>

</body>

</html>