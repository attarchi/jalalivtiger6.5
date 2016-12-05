<?php
/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved. 
 *************************************************************************************/
$languageStrings = array(
	//DetailView Actions
	'SINGLE_Payments' => 'پرداخت',
	'LBL_EXPORT_TO_PDF' => 'Export to PDF',
 
	//Basic strings
	'LBL_ADD_RECORD' => 'Add Payment',
	'LBL_RECORDS_LIST' => 'Payment List',
	'LBL_RECORD_SUMMARY' => 'Payment Summary',

	// Blocks
	'LBL_PAYMENTS_INFORMATION' => 'Payment Details',
    
    //fields
    
    'Related Contact' => 'Related Contact',
    'Related Organization' => 'Related Organization',
    'Amount' => 'Amount',
    'Mode' => 'Mode',
    'Date Received' => 'Date Received',
    'Status'=>'وضعیت',
    
    //status picklist values
    
    'Failure' => 'Failure',
    'Received' => 'Received(Invoice)',
    'Paid' => 'Paid(PurchaseOrder)',
    'Pending' => 'Pending',
    'In Progress' => 'In Progress',
    'Pay Online'=>'Pay Now',
    'Send Link' => 'Send Link',
    
    //Server Configuration
    'LBL_SERVER_CONFIG' => 'Server Configuration',
    
    //Modal Strings
    'LBL_LIST_OF_PROVIDERS' => 'Select your payment gateway',
    'LBL_NO_GATEWAYS_ARE_ACTIVE' => 'No payment gateways active, check payment server configuration',
    'LBL_PAYMENT_DONE' => 'Payment have been received already, please contact your account representative for further details',
    'LBL_PAYMENT_SUCCESS' => 'Thank you, your payments have been accepted successfully. ',
    'LBL_PAYMENT_CANCEL' => 'Sorry! Last transaction was not completed.',
    'LBL_PAYPAL_ERROR' => 'Error with Paypal Account',
    'LBL_PAYMENTS_FOR_INVOICE' => 'Payment for Invoice ',
    'LBL_WITH_PAYMENT_NO' => ' with Payment No ',
    );

$jsLanguageStrings = array(
    
    'JS_CONFIGURE_PAYMENTS_SERVER'=> 'Please configure payments server from settings page',
    'JS_PAYMENTS_SETTINGS' => 'Payments settings',
    
    'JS_PAYMENTS_RECEIVED' => 'Payments received',
    'JS_PAYMENTS_RECEIVED_CREATE_DUPLICATE_RECORD' => 'This payment is already received. Please click on duplicate to create a new payment record',
    
    'JS_PAYMENT_NOT_ALLOWED' => 'Payments Not Allowed',
    'JS_PAYMENTS_FOR_PURCHASE_ORDER_IS_NOT_ALLOWED' => 'Payments for purchase order is not allowed',
    
    'JS_PAID' => 'Paid(PurchaseOrder)',
    'JS_RECEIVED' => 'Received(Invoice)',
    
    'JS_PAYPAL_ERROR' => 'Error with Paypal Account'
);
?>
