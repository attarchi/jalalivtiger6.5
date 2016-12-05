

{*<!--
   /*********************************************************************************
   ** The contents of this file are subject to the vtiger CRM Public License Version 1.0
    * ("License"); You may not use this file except in compliance with the License
    * The Original Code is:  vtiger CRM Open Source
    * The Initial Developer of the Original Code is vtiger.
    * Portions created by vtiger are Copyright (C) vtiger.
    * All Rights Reserved.
   *
    ********************************************************************************/
   -->*}
{strip}
<!DOCTYPE html>
<html>
   <head>
      <title>ورود به سیستم</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <!-- for Login page we are added -->
      <link href="libraries/bootstrap/css/bootstrap.min.css" rel="stylesheet">
      <link href="libraries/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet">
      <link href="libraries/bootstrap/css/jqueryBxslider.css" rel="stylesheet" />
      <script src="libraries/jquery/jquery.min.js"></script>
      <script src="libraries/jquery/boxslider/jqueryBxslider.js"></script>
      <script src="libraries/jquery/boxslider/respond.min.js"></script>

   </head>
   <body>
      <div class="container-fluid login-container">
         <div class="row-fluid">
				<div class="span3">
					<div class="logo"><img src="layouts/vlayout/skins/images/logo.png">
					<br />
					<a target="_blank" href="http://{$COMPANY_DETAILSCOMPANY_DETAILS.website}">{$COMPANY_DETAILS.name}</a>
					</div>
				</div>
				<div class="span9">
					<div class="helpLinks">
		<a href="http://favtiger.ir/">ویتایگر فارسی</a> | 
		<a href="http://forum.favtiger.ir/">انجمن پشتیبانی</a> | 
		<a href="http://favtiger.ir/%d8%a2%d9%85%d9%88%d8%b2%d8%b4-%d9%88%db%8c%d8%aa%d8%a7%db%8c%da%af%d8%b1/">مرکز آموزش</a> | 
		<a href="http://favtiger.ir/category/%d8%a2%d9%85%d9%88%d8%b2%d8%b4/%d9%85%d8%a7%da%98%d9%88%d9%84-%d9%87%d8%a7/">ماژول ها</a> | 
		<a href="http://favtiger.ir/category/%d8%a2%d9%85%d9%88%d8%b2%d8%b4/%d8%aa%d9%86%d8%b8%db%8c%d9%85%d8%a7%d8%aa/">تنظیمات</a> | 
		<a href="http://favtiger.ir/category/%d8%af%d8%a7%d9%86%d9%84%d9%88%d8%af/">دانلود</a>
					</div>
				</div>
			</div>
			
         <div class="row-fluid">
            <div class="span12">
               <div class="content-wrapper">
                  <div class="container-fluid">
                     <div class="row-fluid">
                        <div class="span6 offset3">
                           <div class="login-area">
                              <div class="login-box" id="loginDiv">
                                 <div class="">
                                    
                                    <h5 class="login-header">صفحه ورود ویتایگر فارسی 6.5.2
                                    </h5>
                                 </div>
                                <form class="form-horizontal login-form" style="margin:0;" action="index.php?module=Users&action=Login" method="POST">
			{if isset($smarty.request.error)}
			<div class="alert alert-error">
				<p>Invalid username or password.</p>
			</div>
			{/if}
												{if isset($smarty.request.fpError)}
													<div class="alert alert-error">
														<p>Invalid Username or Email address.</p>
													</div>
												{/if}
												{if isset($smarty.request.status)}
													<div class="alert alert-success">
														<p>Mail has been sent to your inbox, please check your e-mail.</p>
													</div>
												{/if}
												{if isset($smarty.request.statusError)}
													<div class="alert alert-error">
														<p>Outgoing mail server was not configured.</p>
													</div>
												{/if}
												<div class="control-group">
													<label class="control-label" for="username"><b>نام کاربری</b></label>
													<div class="controls">
														<input type="text" id="username" name="username" placeholder="Username">
													</div>
												</div>

			<div class="control-group">
													<label class="control-label" for="password"><b>رمز عبور</b></label>
				<div class="controls">
														<input type="password" id="password" name="password" placeholder="Password">
													</div>
												</div>
												<div class="control-group signin-button">
													<div class="controls" id="forgotPassword">
														<button type="submit" class="btn btn-primary sbutton">ورود</button>
														&nbsp;&nbsp;&nbsp;<a>رمز عبور خود را فراموش کرده اید؟</a>
													</div>
												</div>
												
											</form>
                              </div>
                              <div class="login-box hide" id="forgotPasswordDiv">
                                 <form class="form-horizontal login-form" style="margin:0;" action="forgotPassword.php" method="POST">
                                    <div class="">
                                       <h4 class="login-header">رمزعبور را فراموش کرده اید؟
										</h5>
                                    </div>
                                    <div class="control-group">
                                       <div class="controls">
                                          <input type="text" id="user_name" name="user_name" placeholder="نام کاربری">
                                       </div>
                                    </div>
                                    <div class="control-group">
                                       <div class="controls">
                                          <input type="text" id="emailId" name="emailId"  placeholder="ایمیل">
                                       </div>
                                    </div>
                                    <div class="control-group signin-button">
                                       <div id="backButton">
                                          <input type="submit" class="btn btn-primary sbutton" value="ارسال" name="retrievePassword">
                                          &nbsp;&nbsp;&nbsp;<a>بازگشت</a>
                                       </div>
                                    </div>
                                 </form>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div class="navbar navbar-fixed-bottom">
         <div class="navbar-inner">
            <div class="container-fluid">
               <div class="row-fluid">
                 
                     <div class="footer-content">
					 <center>
                        <small>&#169 2004-{date('Y')}&nbsp;
                        <a href="http://www.vtiger.com"> vtiger.com</a> | تهیه و پشتیبانی توسط <a href="http://favtiger.ir/" target="_blank"> ویتایگر فارسی</a> </small></center>
                     </div>
                  
                  
               </div>
            </div>
         </div>
      </div>
   </body>
   <script>
      jQuery(document).ready(function(){
      	jQuery("#forgotPassword a").click(function() {
      		jQuery("#loginDiv").hide();
      		jQuery("#forgotPasswordDiv").show();
      	});
      	
      	jQuery("#backButton a").click(function() {
      		jQuery("#loginDiv").show();
      		jQuery("#forgotPasswordDiv").hide();
      	});
      	
      	jQuery("input[name='retrievePassword']").click(function (){
      		var username = jQuery('#user_name').val();
      		var email = jQuery('#emailId').val();
      		
      		var email1 = email.replace(/^\s+/,'').replace(/\s+$/,'');
      		var emailFilter = /^[^@]+@[^@.]+\.[^@]*\w\w$/ ;
      		var illegalChars= /[\(\)\<\>\,\;\:\\\"\[\]]/ ;
      		
      		if(username == ''){
      			alert('Please enter valid username');
      			return false;
      		} else if(!emailFilter.test(email1) || email == ''){
      			alert('Please enater valid email address');
      			return false;
      		} else if(email.match(illegalChars)){
      			alert( "The email address contains illegal characters.");
      			return false;
      		} else {
      			return true;
      		}
      		
      	});
      });
   </script>
</html>
{/strip}

