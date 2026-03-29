import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  public type MenuItem = {
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    isJain : Bool;
    isVaishnav : Bool;
  };

  public type MenuCategory = {
    id : Text;
    name : Text;
    description : Text;
    items : [MenuItem];
  };

  public type Testimonial = {
    id : Nat;
    from : Text;
    review : Text;
    rating : Nat;
    timestamp : Time.Time;
  };

  public type PromotionalMaterial = {
    id : Text;
    title : Text;
    file : Storage.ExternalBlob;
  };

  public type ContactSubmission = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    timestamp : Time.Time;
  };

  public type Infographic = {
    title : Text;
    description : Text;
    icon : Text;
    graphic : Storage.ExternalBlob;
  };

  public type Section = {
    title : Text;
    description : Text;
    subsections : [Subsection];
    icon : Text;
    infographic : ?Infographic;
  };

  public type Subsection = {
    title : Text;
    content : Text;
    items : [SubsectionItem];
  };

  public type SubsectionItem = {
    title : Text;
    description : Text;
  };

  public type DetailedMenu = {
    categories : [MenuCategory];
    sections : [Section];
  };

  public type OrderStatus = {
    #pending;
    #paid;
    #confirmed;
    #whatsappConfirmed;
    #cancelled;
  };

  public type OrderType = {
    #singleItem : MenuItem;
    #cart : { items : [MenuItem] };
  };

  public type Order = {
    id : Nat;
    orderType : OrderType;
    total : Float;
    upiId : Text;
    whatsappNumber : Text;
    address : Text;
    deliveryDistanceKm : Float;
    deliveryCharge : Float;
    status : OrderStatus;
    timestamp : Time.Time;
  };

  public type OrderStore = {
    orders : Map.Map<Nat, Order>;
    nextOrderId : Nat;
  };

  public type TestimonialStore = {
    testimonials : Map.Map<Nat, Testimonial>;
    nextTestimonialId : Nat;
  };

  public type ContactSubmissionStore = {
    submissions : Map.Map<Nat, ContactSubmission>;
    nextSubmissionId : Nat;
  };

  var orderStore : OrderStore = {
    orders = Map.empty<Nat, Order>();
    nextOrderId = 1;
  };

  var testimonialStore : TestimonialStore = {
    testimonials = Map.empty<Nat, Testimonial>();
    nextTestimonialId = 1;
  };

  var contactSubmissionStore : ContactSubmissionStore = {
    submissions = Map.empty<Nat, ContactSubmission>();
    nextSubmissionId = 1;
  };

  // New promo material store
  var promoMaterialStore : Map.Map<Text, PromotionalMaterial> = Map.empty();

  let userProfiles = Map.empty<Principal, UserProfile>();

  let detailedMenu : DetailedMenu = {
    categories = [
      {
        id = "thali-menu";
        name = "Thali Menu";
        description = "Traditional vegetarian thali options, featuring authentic Jain and Vaishnav cuisine. All items are pure vegetarian with no onion and no garlic.";
        items = [
          {
            name = "Pure Jain Thali";
            description = "250ml Daal, 250ml Dry or Semi-Gravy Vegetable, 300g Rice, Four Chapatis (Tawa), Salad";
            price = 170.0;
            category = "Thali";
            isJain = true;
            isVaishnav = true;
          },
          {
            name = "Vaishnav Thali";
            description = "250ml Daal, 250ml Dry or Semi-Gravy Vegetable, 300g Rice, Four Chapatis (Tawa), Salad";
            price = 170.0;
            category = "Thali";
            isJain = false;
            isVaishnav = true;
          },
          {
            name = "Special Thali";
            description = "250ml Daal, 250ml Dry or Semi-Gravy Vegetable, 300g Jeera Rice, Four Chapatis (Tawa), 1 Sweet, 1 Curd, Salad";
            price = 210.0;
            category = "Thali";
            isJain = true;
            isVaishnav = true;
          },
          {
            name = "Deluxe Thali";
            description = "250ml Paneer or Soya Chaap, 250ml Daal Makhani or Kadhi Pakoda, 300g Matar Pulao, Four Chapatis (Tawa), 1 Sweet, 1 Curd, Salad";
            price = 270.0;
            category = "Thali";
            isJain = false;
            isVaishnav = true;
          },
        ];
      },
      {
        id = "extras";
        name = "Extras";
        description = "Additional items to complement your thali experience. All items customized to suit Jain and Vaishnav dietary preferences.";
        items = [
          {
            name = "Paneer or Soya Chaap";
            description = "Fresh paneer or soya chaap dishes with pure vegetarian ingredients.";
            price = 100.0;
            category = "Extras";
            isJain = true;
            isVaishnav = true;
          },
          {
            name = "Daal Makhani or Kadhi";
            description = "Rich and flavorful daal makhani or kadhi prepared with pure vegetarian methods.";
            price = 70.0;
            category = "Extras";
            isJain = false;
            isVaishnav = true;
          },
          {
            name = "Matar Pulao";
            description = "Fragrant rice cooked with green peas and spices.";
            price = 60.0;
            category = "Extras";
            isJain = true;
            isVaishnav = true;
          },
          {
            name = "Rice";
            description = "Steamed rice, perfect accompaniment to your meal.";
            price = 60.0;
            category = "Extras";
            isJain = true;
            isVaishnav = true;
          },
          {
            name = "Curd";
            description = "Refreshing and creamy curd.";
            price = 50.0;
            category = "Extras";
            isJain = true;
            isVaishnav = true;
          },
        ];
      },
    ];
    sections = [
      {
        title = "Tiffin Services";
        description = "Convenient vegetarian meals for everyday needs. Includes a variety of wholesome options, all pure vegetarian and in compliance with Jain and Vaishnav dietary standards.";
        icon = "🥗";
        infographic = null;
        subsections = [
          {
            title = "Meal Components";
            content = "A variety of pure vegetarian meal options, each includes:";
            items = [
              { title = "Daal (250 ml)"; description = "Rajma, Chole, Kadhi" },
              {
                title = "Seasonal Vegetables (250 ml)";
                description = "Paneer, Soybean, Soya Chaap, Kofte Mushroom";
              },
              { title = "Chapati"; description = "Four pieces" },
              { title = "Rice"; description = "170 grams per serving" },
              { title = "Salad"; description = "Fresh seasonal vegetables" },
            ];
          },
          {
            title = "Pricing Structure";
            content = "Affordable pricing options for all Tiffin Services:";
            items = [
              {
                title = "Random Customer";
                description = "Single day service: Rs. 150/-";
              },
              {
                title = "Regular Customer";
                description = "Standard rate for ongoing service: Rs. 110/-";
              },
            ];
          },
        ];
      },
      {
        title = "Corporate Buffet Services";
        description = "Premium buffet options for corporate events. All offerings are pure vegetarian with special care in compliance with Jain and Vaishnav standards.";
        icon = "🍽️";
        infographic = null;
        subsections = [
          {
            title = "Buffet Options and Pricing";
            content = "Flexible buffet options with diverse menu items. Pricing varies based on services selected and event type:";
            items = [
              {
                title = "Regular Buffet";
                description = "Standard buffet service: Rs. 350/- per person";
              },
              {
                title = "Occasional Buffet";
                description = "Special occasions and custom services: Rs. 450/- per person";
              },
            ];
          },
          {
            title = "Buffet Menu - 8 Items";
            content = "A curated mix of vegetarian cuisine, offering choice and variety:";
            items = [
              {
                title = "Daal (Choose One)";
                description = "Makhani, Kadhi, Daal Tadka";
              },
              {
                title = "Vegetable Dishes";
                description = "Variety of seasonal options";
              },
              {
                title = "Paneer (Any One)";
                description = "Matar Paneer, Matar Paneer Masala, Shahi Paneer, Kadhai Paneer";
              },
              {
                title = "Rice (Any One)";
                description = "Jeera Rice, Matar Pulao, Vegetable Pulao";
              },
              {
                title = "Bread Per Person (Any One)";
                description = "4 Chapati, 3 Tandoori Roti, 2 Butter Naan";
              },
              {
                title = "Raita - 170 ml per person (Any One)";
                description = "Masala Raita, Cucumber Raita, Mix Raita";
              },
              {
                title = "Sweet (Any One)";
                description = "Kheer, Suji Halwa, Gulab Jamun";
              },
              {
                title = "Salad (Any One)";
                description = "Seasonal Vegetable, Sirka Salad";
              },
            ];
          },
        ];
      },
      {
        title = "Catering Services";
        description = "Comprehensive on-site catering solutions with a focus on pure vegetarian cuisine.";
        icon = "🍲";
        infographic = null;
        subsections = [
          {
            title = "Pricing Structure";
            content = "Flexible services starting from Rs. 450/- for 100+ guests. Pricing may vary depending on host requirements and event type.";
            items = [
              {
                title = "Base Price Service For 100+ Guests";
                description = "Rs. 450/- including basic vegetarian meals and event management.";
              },
              {
                title = "Rates are dependent on host demands";
                description = "Custom packages can be discussed for specific needs.";
              },
              {
                title = "Only pure vegetarian food provided";
                description = "Adherence to Jain & Vaishnav standards ensured in all services.";
              },
            ];
          },
        ];
      },
    ];
  };

  // User Profile Functions - Require user authentication
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view user's own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profile");
    };
    userProfiles.add(caller, profile);
  };

  // Testimonial Functions - Admin only for adding/importing
  public shared ({ caller }) func addTestimonial(from : Text, review : Text, rating : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can add testimonials");
    };

    if (from == "" or review == "") {
      Runtime.trap("Invalid Request: Name and review are required");
    };

    if (rating > 5) {
      Runtime.trap("Invalid Request: Rating must be between 0 and 5");
    };

    let id = testimonialStore.nextTestimonialId;
    let testimonial : Testimonial = {
      id;
      from;
      review;
      rating;
      timestamp = Time.now();
    };
    testimonialStore.testimonials.add(id, testimonial);
    testimonialStore := {
      testimonialStore with nextTestimonialId = testimonialStore.nextTestimonialId + 1;
    };
  };

  public shared ({ caller }) func importTestimonial(from : Text, review : Text, rating : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can import testimonials");
    };

    if (from == "" or review == "") {
      Runtime.trap("Invalid Request: Name and review are required");
    };

    if (rating > 5) {
      Runtime.trap("Invalid Request: Rating must be between 0 and 5");
    };

    let id = testimonialStore.nextTestimonialId;
    let testimonial : Testimonial = {
      id;
      from;
      review;
      rating;
      timestamp = Time.now();
    };
    testimonialStore.testimonials.add(id, testimonial);
    testimonialStore := {
      testimonialStore with nextTestimonialId = testimonialStore.nextTestimonialId + 1;
    };
  };

  // Public query - anyone can view testimonials
  public query func getAllTestimonials() : async [Testimonial] {
    testimonialStore.testimonials.values().toArray();
  };

  // Contact Form - Allows guests (anonymous users) to submit
  public shared ({ caller }) func submitContactForm(
    name : Text,
    email : Text,
    phone : Text,
    message : Text,
  ) : async () {
    // Allow all users including guests to submit contact forms
    // This is a public-facing business website feature

    if (name == "" or email == "" or phone == "" or message == "") {
      Runtime.trap("Invalid Request: All fields are required");
    };

    if (name.size() > 100 or email.size() > 100 or phone.size() > 20 or message.size() > 1000) {
      Runtime.trap("Invalid Request: Input exceeds maximum length");
    };

    let id = contactSubmissionStore.nextSubmissionId;
    let submission : ContactSubmission = {
      id;
      name;
      email;
      phone;
      message;
      timestamp = Time.now();
    };
    contactSubmissionStore.submissions.add(id, submission);
    contactSubmissionStore := {
      contactSubmissionStore with nextSubmissionId = contactSubmissionStore.nextSubmissionId + 1;
    };
  };

  // Admin only - view all contact submissions
  public query ({ caller }) func getAllContactSubmissions() : async [ContactSubmission] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view contact submissions");
    };
    contactSubmissionStore.submissions.values().toArray();
  };

  // Menu Functions - Public queries, anyone can view
  public query func getMenuCategory(id : Text) : async ?MenuCategory {
    detailedMenu.categories.find(func(category) { category.id == id });
  };

  public query func getMenu() : async [MenuCategory] {
    detailedMenu.categories;
  };

  public query func getDetailedMenu() : async DetailedMenu {
    detailedMenu;
  };

  public query func getMenuSection(title : Text) : async ?Section {
    detailedMenu.sections.find(func(section) { section.title == title });
  };

  public query func getAllMenuSections() : async [Section] {
    detailedMenu.sections;
  };

  public query func downloadMenuPDF() : async ?Storage.ExternalBlob {
    null;
  };

  // Order Functions - Admin only for viewing all orders
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can access this data");
    };
    orderStore.orders.values().toArray();
  };

  public query ({ caller }) func getOrderById(id : Nat) : async ?Order {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can access this data");
    };
    orderStore.orders.get(id);
  };

  // Public queries - deployment information
  public query func getPermanentCanisterURL() : async Text {
    "https://klp5p-hyaaa-aaaal-acrmq-cai.icp0.io";
  };

  public type DeploymentStatus = {
    canisterURL : Text;
    dnsInstructions : Text;
    isPermanent : Bool;
    verified : Bool;
  };

  public query func getDeploymentStatus() : async DeploymentStatus {
    {
      canisterURL = "https://klp5p-hyaaa-aaaal-acrmq-cai.icp0.io";
      dnsInstructions = "To integrate this permanent Internet Computer canister with your GoDaddy domain (prashadamfood.com), please add a CNAME record to GoDaddy's DNS settings pointing prashadamfood.com to klp5p-hyaaa-aaaal-acrmq-cai.icp0.io. This will enable seamless domain mapping and ensure permanent hosting for your Prashadam Food website with secure SSL support. Both prashadamfood.com and www.prashadamfood.com are now recognized as valid custom domains.";
      isPermanent = true;
      verified = true;
    };
  };

  // Order Placement - Allows guests (anonymous users) to place orders
  // This is a public-facing food business website where customers should be able to order easily
  public shared ({ caller }) func placeOrder(
    orderType : OrderType,
    total : Float,
    address : Text,
    deliveryDistanceKm : Float,
  ) : async () {
    // Allow all users including guests to place orders
    // This is a B2C food service business with external payment (UPI) and WhatsApp confirmation

    if (address == "" or address.size() < 10) {
      Runtime.trap("Invalid Request: Valid delivery address is required");
    };

    if (address.size() > 500) {
      Runtime.trap("Invalid Request: Address exceeds maximum length");
    };

    if (deliveryDistanceKm <= 0.0 or deliveryDistanceKm > 50.0) {
      Runtime.trap("Invalid Request: Delivery distance must be between 1 and 50 kilometers");
    };

    if (total <= 0.0 or total > 100000.0) {
      Runtime.trap("Invalid Request: Invalid order total");
    };

    let deliveryCharge = calculateDeliveryCharge(total, deliveryDistanceKm);

    let id = orderStore.nextOrderId;
    let order : Order = {
      id;
      orderType;
      total;
      upiId = "8802452190@okbizaxis";
      whatsappNumber = "+918802452190";
      address;
      deliveryDistanceKm;
      deliveryCharge;
      status = #pending;
      timestamp = Time.now();
    };

    orderStore.orders.add(id, order);
    orderStore := {
      orderStore with nextOrderId = orderStore.nextOrderId + 1;
    };
  };

  // Admin only - update order status
  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update order status");
    };

    switch (orderStore.orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder : Order = { order with status };
        orderStore.orders.add(orderId, updatedOrder);
      };
    };
  };

  // Admin only - confirm UPI payment
  public shared ({ caller }) func confirmUpiPayment(orderId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can confirm payments");
    };

    switch (orderStore.orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder : Order = { order with status = #paid };
        orderStore.orders.add(orderId, updatedOrder);
      };
    };
  };

  // Admin only - upload promotional material
  public shared ({ caller }) func uploadPromoMaterial(id : Text, title : Text, file : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can upload promotional material");
    };

    if (id == "" or title == "") {
      Runtime.trap("Invalid Request: ID and title are required");
    };

    // Enforce single primary logo (logo type must be "logo")
    if (id == "logo") {
      if (promoMaterialStore.containsKey("logo")) {
        Runtime.trap("Primary logo already set. Use updateLogo() to change the existing logo");
      };
    };

    let promoMaterial : PromotionalMaterial = {
      id;
      title;
      file;
    };

    promoMaterialStore.add(id, promoMaterial);
  };

  // Admin only - update promotional logo
  public shared ({ caller }) func updateLogo(newLogo : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update logo");
    };

    let logoMaterial : PromotionalMaterial = {
      id = "logo";
      title = "Prashadam Enhanced Logo";
      file = newLogo;
    };

    promoMaterialStore.add("logo", logoMaterial);
  };

  // Public query - anyone can view and download promotional material
  public query func getPromoMaterial(id : Text) : async ?PromotionalMaterial {
    promoMaterialStore.get(id);
  };

  // Public query - get logo
  public query func getLogo() : async ?PromotionalMaterial {
    promoMaterialStore.get("logo");
  };

  // Private helper function for delivery charge calculation
  func calculateDeliveryCharge(total : Float, deliveryDistanceKm : Float) : Float {
    if (total >= 600.0) {
      if (deliveryDistanceKm <= 3.0) {
        0.0;
      } else {
        (deliveryDistanceKm - 3.0) * 70.0;
      };
    } else {
      deliveryDistanceKm * 70.0;
    };
  };
};

