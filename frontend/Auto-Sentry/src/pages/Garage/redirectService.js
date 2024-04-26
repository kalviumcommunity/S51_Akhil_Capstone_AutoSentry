const RedirectService = (make) => {
    let serviceURL = "";
    switch (make) {
      case "Audi":
        serviceURL = "https://www.audi.in/in/web/en/customer-area/service-warranty.html";
        break;
      case "Ashok Leyland":
        serviceURL = "https://www.ashokleyland.com/aftermarket";
        break;
      case "Bentley":
        serviceURL = "https://newdelhi.bentleymotors.com/meia/en/service-offers/service";
        break;
      case "BMW":
        serviceURL = "https://onlineappointment.bmw.in/en/index";
        break;
      case "Bugatti":
        serviceURL = "https://www.bugatti.com/ownership/customer-service/";
        break;
      case "BYD":
        serviceURL = "https://bydautoindia.com/enquire-now?gad_source=1";
        break;
      case "Chevrolet":
        serviceURL = "https://www.chevrolet.co.in/owners-area/chevrolet-service";
        break;
      case "Citroen":
        serviceURL = "https://servicebookingonline.citroen.in/en-IN/online-booking-citroen";
        break;
      case "Datsun":
        serviceURL = "https://www.one.nissan.in/login?ReturnUrl=%2Fbook-a-service%3Futm_source%3Dpace%26utm_medium%3Ddirect";
        break;
      case "Ferrari":
        serviceURL = "https://delhi.ferraridealers.com/en-GB/ferrari-book-service";
        break;
      case "Fiat":
        serviceURL = "https://www.fiat-india.com/tools/find-a-workshop";
        break;
      case "Force":
        serviceURL = "https://www.forcemotors.com/";
        break;
      case "Ford":
        serviceURL = "https://ford-web-ui.excellonconnect.com/appointmentBooking";
        break;
      case "Honda":
        serviceURL = "https://www.hondacarindia.com/honda-services/book-a-service";
        break;
      case "Hyundai":
        serviceURL = "https://www.hyundai.com/in/en/connect-to-service/hyundai-service/book-a-service";
        break;
      case "Isuzu":
        serviceURL = "https://isuzu.in/atyourservice";
        break;
      case "Jaguar":
        serviceURL = "https://www.jaguar.in/ownership/service-warranties/book-service-online.html";
        break;
      case "Jeep":
        serviceURL = "https://www.jeep-india.com/shopping_tools/mopar.html";
        break;
      case "Kia":
        serviceURL = "https://www.kia.com/in/service/iot-experience/service-booking.html";
        break;
      case "Lamborghini":
        serviceURL = "https://www.lamborghini.com/en-en/ownership/service";
        break;
      case "Land Rover":
        serviceURL = "https://www.landrover.in/ownership/book-service-online.html";
        break;
      case "Lexus":
        serviceURL = "https://www.lexusindia.co.in/en/contact-us/book-a-service.html";
        break;
      case "Mahindra":
        serviceURL = "https://www.mmmotorsmahindra.co.in/bookservice.html";
        break;
      case "Maserati":
        serviceURL = "https://www.maserati.com/in/en/official-dealer";
        break;
      case "MG":
        serviceURL = "https://www.mgmotor.co.in/tools/service-booking";
        break;
      case "Mini":
        serviceURL = "https://www.mini.in/en_IN/home/serv/service-and-repair/maintenance-and-repair.html";
        break;
      case "Mitsubishi":
        serviceURL = "https://mitsubishi-motors.co.in/online-service-booking-thank-you/";
        break;
      case "Nissan":
        serviceURL = "https://www.one.nissan.in/login?ReturnUrl=%2Fbook-a-service%3Futm_source%3Dpace%26utm_medium%3Ddirect";
        break;
      case "Porsche":
        serviceURL = "https://www.porsche.com/middle-east/_india_/accessoriesandservice/porscheservice/";
        break;
      case "Renault":
        serviceURL = "https://www.renault.co.in/renault-service.html";
        break;
      case "Rolls-Royce":
        serviceURL = "https://www.rolls-roycemotorcars.com/newdelhi/en_GB/ownership-services.html";
        break;
      case "Skoda":
        serviceURL = "https://www.skoda-auto.co.in/owners-support/book-service-appointment";
        break;
      case "Tata Motors":
        serviceURL = "https://cars.tatamotors.com/service.html";
        break;
      case "Toyota":
        serviceURL = "https://www.toyotabharat.com/q-service/";
        break;
      case "Volkswagen":
        serviceURL = "https://www.volkswagen.co.in/app/site/volkswagenservice/";
        break;
      case "Volvo":
        serviceURL = "https://volvoid.eu.volvocars.com/VolvoLogin/login?resumePath=nZukGXVA6g&client_id=Rf0n3Pz_10&relayFlags={%22hideInfoLink%22%3Atrue}&language=en&market=IN";
        break;
  
      default:
        serviceURL = "https://www.example.com/service-booking";
        break;
    }
    window.open(serviceURL, "_blank");
  };
  
  export default RedirectService;
  