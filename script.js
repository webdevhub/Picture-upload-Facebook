function facebookAPI(appId) {
	/*Private Variables*/
	this.appId = appId;
	this.accessToken = "";
	/*Public Functions*/
	this.init = function() {
			//initialize the Facebook API
			FB.init({appId : this.appId, status : true,cookie : true,xbfml : true});
			//disable the Upload button
			toggleUpload(false);
		};
	//this function Logs In the person into application
	this.login = function() {
			updateStatus("Now trying to get the permisions from Facebook account");
			FB.login(
			    function(response) {
			      if (response.session) {
				  updateStatus("Logged in. Now you can upload pictures.");
				  toggleUpload(true);
				  
				  document.getElementById("loginBtn").value = "Permisions Granted";
				  document.getElementById("loginBtn").disabled = "disabled";
				  
				  document.forms[0].getElementsByTagName("input")[0].value = accessToken();
				  
				  //get the "name" of albums from the Facebook Profile
				  albums();
			      } else {
				document.getElementById("status").innerHTML= "You have not given this application required permissions";
			      }
			    },{perms:'publish_stream,user_photos'}
			);
		};
	//this function "submits" the form so that the Image gets uploaded to Facebook
	this.upload = function () {
		var form = document.forms[0];
		form.action = "https://graph.facebook.com/"+form.getElementsByTagName("select")[0].value+"/photos";
		if(form.getElementsByTagName("input")[2].value=="Some caption here..")
			form.getElementsByTagName("input")[2].value = "";
		updateStatus("Uploading...Now, you will go to some other page");
		form.submit();
	}
	/*Private Functions*/
	albums = function() {
		  updateStatus("Getting album information from your Facebook profile");
		  var counter = 0;
		  FB.api('/me/albums', function(response) {
			for(var c in response["data"]) {
				appendToOption(response["data"][c].name,response["data"][c].id);
				counter++;
			}
			updateStatus("There are "+ counter +" albums from in your Facebook profile");
		  });
		};
	//adds the Albums names to the dropdown box in form
	appendToOption = function(name,value) {
			var option = document.createElement("option");
			option.value = value;
			option.innerHTML = name;
			document.getElementById("album").appendChild(option);
		};
	//updates the "Status" div
	updateStatus = function(msg) {
			document.getElementById("status").innerHTML = msg;
	};
	//this function extracts Access_Token from the cookie associated with the page
	accessToken = function() {
		splitArray = document.cookie.split(";");
		access_token = "";
		for(var v in splitArray) {
			if(splitArray[v].substr(0,4)==" fbs") {
				access_token = splitArray[v];
				break;
			}
		}
		var arr = access_token.split("&")[0].split("=");
		return arr[arr.length-1];
	}
	//this function disables or enables the Upload button
	toggleUpload = function(toogle) {
		if(toogle==true)
			document.getElementById("uploadBtn").disabled = "";
		else if(toogle==false)
			document.getElementById("uploadBtn").disabled = "disabled";
	};
};