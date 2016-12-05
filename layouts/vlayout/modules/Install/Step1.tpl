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

<div class="row-fluid main-container">
	<div class="inner-container">
		<div class="row-fluid">
			<div class="span10">
				<h4>{vtranslate('LBL_WELCOME', 'Install')}</h4>
			</div>
			<div class="span2">
				<a href="http://favtiger.ir/category/%d8%a2%d9%85%d9%88%d8%b2%d8%b4/%d9%86%d8%b5%d8%a8-%d9%88-%d8%b1%d8%a7%d9%87-%d8%a7%d9%86%d8%af%d8%a7%d8%b2%db%8c/" target="_blank" class="pull-right">
					<img src="{'help.png'|vimage_path}" alt="Help-Icon"/>
				</a>
			</div>
		</div>
		<hr>

		<form class="form-horizontal" name="step1" method="post" action="index.php">
			<input type=hidden name="module" value="Install" />
			<input type=hidden name="view" value="Index" />
			<input type=hidden name="mode" value="Step2" />
			<div class="row-fluid">
				<div class="span4 welcome-image">
					<img src="{'wizard_screen.png'|vimage_path}" alt="Vtiger Logo"/>
				</div>
				<div class="span8">
					<div class="welcome-div">
						<h3>{vtranslate('LBL_WELCOME_TO_VTIGER6_SETUP_WIZARD', 'Install')}</h3>
						{vtranslate('LBL_VTIGER6_SETUP_WIZARD_DESCRIPTION','Install')}
					</div>
					{if $LANGUAGES|@count > 1}
					<div>
						<label>{vtranslate('LBL_CHOOSE_LANGUAGE', 'Install')}
							<select name="lang" id="lang">
							{foreach key=header item=language from=$LANGUAGES}
								<option value="{$header}" {if $header eq $CURRENT_LANGUAGE}selected{/if}>{vtranslate("$language",'Install')}</option>
							{/foreach}
							</select>
						</label>
					</div>
					{/if}
				</div>
			</div>
			<div class="row-fluid">
				<div class="button-container">
					<input type="submit" class="btn btn-large btn-primary" value="{vtranslate('LBL_INSTALL_BUTTON','Install')}"/>
				</div>
			</div>
		</form>
	</div>
</div>