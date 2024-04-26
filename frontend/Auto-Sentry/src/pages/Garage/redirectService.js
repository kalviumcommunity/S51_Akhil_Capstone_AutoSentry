const serviceUrls = {
    Audi: "https://www.audi.in/in/web/en/customer-area/service-warranty.html",
    "Ashok Leyland": "https://www.ashokleyland.com/aftermarket",
    Bentley: "https://newdelhi.bentleymotors.com/meia/en/service-offers/service",
    BMW: "https://onlineappointment.bmw.in/en/index",
    Bugatti: "https://www.bugatti.com/ownership/customer-service/",
    BYD: "https://bydautoindia.com/enquire-now?gad_source=1",
    Chevrolet: "https://www.chevrolet.co.in/owners-area/chevrolet-service",
    Citroen: "https://servicebookingonline.citroen.in/en-IN/online-booking-citroen",
    Datsun: "https://www.one.nissan.in/login?ReturnUrl=%2Fbook-a-service%3Futm_source%3Dpace%26utm_medium%3Ddirect",
    Ferrari: "https://delhi.ferraridealers.com/en-GB/ferrari-book-service",
    Fiat: "https://www.fiat-india.com/tools/find-a-workshop",
    Force: "https://www.forcemotors.com/",
    Ford: "https://ford-web-ui.excellonconnect.com/appointmentBooking",
    Honda: "https://www.hondacarindia.com/honda-services/book-a-service",
    Hyundai: "https://www.hyundai.com/in/en/connect-to-service/hyundai-service/book-a-service",
    Isuzu: "https://isuzu.in/atyourservice",
    Jaguar: "https://www.jaguar.in/ownership/service-warranties/book-service-online.html",
    Jeep: "https://www.jeep-india.com/shopping_tools/mopar.html",
    Kia: "https://www.kia.com/in/service/iot-experience/service-booking.html",
    Lamborghini: "https://www.lamborghini.com/en-en/ownership/service",
    "Land Rover": "https://www.landrover.in/ownership/book-service-online.html",
    Lexus: "https://www.lexusindia.co.in/en/contact-us/book-a-service.html",
    Mahindra: "https://www.mmmotorsmahindra.co.in/bookservice.html",
    Maserati: "https://www.maserati.com/in/en/official-dealer",
    MG: "https://www.mgmotor.co.in/tools/service-booking",
    Mini: "https://www.mini.in/en_IN/home/serv/service-and-repair/maintenance-and-repair.html",
    Mitsubishi: "https://mitsubishi-motors.co.in/online-service-booking-thank-you/",
    Nissan: "https://www.one.nissan.in/login?ReturnUrl=%2Fbook-a-service%3Futm_source%3Dpace%26utm_medium%3Ddirect",
    Porsche: "https://www.porsche.com/middle-east/_india_/accessoriesandservice/porscheservice/",
    Renault: "https://www.renault.co.in/renault-service.html",
    "Rolls-Royce": "https://www.rolls-roycemotorcars.com/newdelhi/en_GB/ownership-services.html",
    Skoda: "https://www.skoda-auto.co.in/owners-support/book-service-appointment",
    "Tata Motors": "https://cars.tatamotors.com/service.html",
    Toyota: "https://www.toyotabharat.com/q-service/",
    Volkswagen: "https://www.volkswagen.co.in/app/site/volkswagenservice/",
    Volvo: "https://volvoid.eu.volvocars.com/VolvoLogin/login?resumePath=nZukGXVA6g&client_id=Rf0n3Pz_10&relayFlags={%22hideInfoLink%22%3Atrue}&language=en&market=IN"
  };
  
  const RedirectService = (make) => {
    const serviceURL = serviceUrls[make] || "https://www.example.com/service-booking";
    window.open(serviceURL, "_blank");
  };
  
  export default RedirectService;
  