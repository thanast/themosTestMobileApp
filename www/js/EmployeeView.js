var EmployeeView = function(employee) {

    this.initialize = function() {
        this.el = $('<div/>');
        this.el.on('click', '.add-location-btn', this.addLocation);
        this.el.on('click', '.add-contact-btn', this.addToContacts);
        this.el.on('click', '.change-pic-btn', this.changePicture);
        this.el.on('click', '.add-barcode-bt', this.addBarcode);
        
    };

    this.render = function() {
        this.el.html(EmployeeView.template(employee));
        return this;
    };

		this.addLocation = function(event) {
		    event.preventDefault();
		    console.log('addLocation');
		    navigator.geolocation.getCurrentPosition(
		        function(position) {
		            $('.location', this.el).html(position.coords.latitude + ',' + position.coords.longitude);
		        },
		        function() {
		            alert('Error getting location');
		        });
		    return false;
		};
		
		this.addBarcode = function(event) {
			if (!cordova.plugins.barcodeScanner) {
		        app.showAlert("BarCode API not supported", "Error");
		        return;
		    }
			 cordova.plugins.barcodeScanner.scan(
		      function (result) {
		      	app.showAlert("We got a barcode\n" +
		                "Result: " + result.text + "\n" +
		                "Format: " + result.format + "\n" +
		                "Cancelled: " + result.cancelled);
		      },
		      function (error) {
		          app.showAlert("Scanning failed: " + error);
		      },
		      {
		          preferFrontCamera : true, // iOS and Android
		          showFlipCameraButton : true, // iOS and Android
		          showTorchButton : true, // iOS and Android
		          torchOn: true, // Android, launch with the torch switched on (if available)
		          saveHistory: true, // Android, save scan history (default false)
		          prompt : "Place a barcode inside the scan area", // Android
		          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
		          formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
		          orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
		          disableAnimations : true, // iOS
		          disableSuccessBeep: false, // iOS and Android
		          continuousMode: false // Android
		      }
		   );		   		
		 };
		 
		this.addToContacts = function(event) {   
    		event.preventDefault();
		    console.log('addToContacts');
		    if (!navigator.contacts) {
		        app.showAlert("Contacts API not supported", "Error");
		        return;
		    }
		    var contact = navigator.contacts.create();
		    contact.name = {givenName: employee.firstName, familyName: employee.lastName};
		    var phoneNumbers = [];
		    phoneNumbers[0] = new ContactField('work', employee.officePhone, false);
		    phoneNumbers[1] = new ContactField('mobile', employee.cellPhone, true); // preferred number
		    contact.phoneNumbers = phoneNumbers;
		    contact.save();
		    return false;
		};
		
		this.changePicture = function(event) {
		    event.preventDefault();
		    if (!navigator.camera) {
		        app.showAlert("Camera API not supported", "Error");
		        return;
		    }
		    var options =   {   quality: 50,
		                        destinationType: Camera.DestinationType.DATA_URL,
		                        sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
		                        encodingType: 0     // 0=JPG 1=PNG
		                    };
		 
		    navigator.camera.getPicture(
		        function(imageData) {
		            $('.employee-image', this.el).attr('src', "data:image/jpeg;base64," + imageData);
		        },
		        function() {
		            app.showAlert('Error taking picture', 'Error');
		        },
		        options);
		 
		    return false;
		};

    this.initialize();

 }

EmployeeView.template = Handlebars.compile($("#employee-tpl").html());