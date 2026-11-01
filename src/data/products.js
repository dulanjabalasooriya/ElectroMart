// Sample catalog. Replace sample images, prices, stock and ratings with real data later.
export const categories = [
  { id: 'all', label: 'All products' },
  { id: 'smartphones', label: 'Smartphones' },
  { id: 'feature-phones', label: 'Feature phones' },
  { id: 'phone-accessories', label: 'Phone accessories' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'desktops', label: 'Desktop PCs' },
  { id: 'monitors', label: 'Monitors' },
  { id: 'computer-accessories', label: 'Computer accessories' },
  { id: 'headphones', label: 'Headphones' },
  { id: 'earbuds', label: 'Earbuds' },
  { id: 'speakers', label: 'Speakers' },
  { id: 'smartwatches', label: 'Smart watches' },
  { id: 'fitness-trackers', label: 'Fitness trackers' },
  { id: 'televisions', label: 'Smart TVs' },
  { id: 'home-appliances', label: 'Home appliances' },
  { id: 'gaming-consoles', label: 'Gaming consoles' },
  { id: 'gaming-accessories', label: 'Gaming accessories' },
  { id: 'gifts', label: 'Gift bundles' },
];


const p = (
  id, name, brand, category,
  price, oldPrice, rating, reviews, stock, image
) => ({
  id,
  name,
  brand,
  category,
  price,
  oldPrice,
  rating,
  reviews,
  stock,
  image: `/images/products/${image}`
});

export const products = [
 p(1,"Apple iPhone 17","APPLE","smartphones",119900,139900,4.8,248,12,"iphone17.jpg"),
 p(2,"Samsung Galaxy S26 Ultra","SAMSUNG","smartphones",291500,304900,4.6,191,17,"Samsung.jpg"),
 p(3,"Xiaomi Redmi 15C","XIAOMI / Redmi","smartphones",58500,79000,4.2,78,21,"redmi.jpg"),
 p(4,"Aspor A372 10000mAh 22.5W Dual Fast Charging Power Bank","ASPOR","phone-accessories",7900,9900,4.6,932,20,"AsporPowerbank.jpg"),
 p(5,"Lenovo Legion 5 15AGP11 - Ryzen AI 9 (RTX 5060)","LENOVO","laptops",815000,855000,4.7,184,7,"lenovo.jpg"),
 p(6,"MSI Cyborg 15 Black Edition Gaming A13UC - i5","MSI","laptops",340000,349900,4.8,156,4,"MSIlaptop.jpg"),
 p(7,"Chuwi UBox Mini PC – Ryzen 5 6600H","CHUWI","desktops",202000,212900,4.5,83,6,"chuwi.jpg"),
 p(8,"Philips 27E1N2100D Full HD 27″ Monitor","PHILIPS","monitors",43200,47200,4.6,124,9,"philips.jpg"),
 p(9,"BAJEAL K35 Colorful Rainbow Backlight Ergonomic Usb Wire Waterproof Rgb Gaming Keyboard","BAJEAL","computer-accessories",15900,19900,4.5,201,16,"keyboard.jpg"),
 p(10,"Celebrat A36 Foldable Headphone","CELEBRAT","headphones",29900,36900,4.7,803,12,"headphone.jpg"),
 p(11,"Pulse Buds 2 Wireless","PULSE","earbuds",15900,19900,4.4,311,18,"earbuds.jpg"),
 p(12,"Jbl Grip Portable Bluetooth Speaker","JBL","speakers",21900,25900,4.5,178,11,"speaker.jpg"),
 p(13,"Amazfit Bip Max Smartwatch","AMAZFIT","smartwatches",44900,52900,4.6,296,8,"watch.jpg"),
 p(14,"Green Lion Fit Air Smart Fitness Band","GREEN LION","fitness-trackers",14900,16900,4.3,640,23,"fitness.jpg"),
 p(15,"Samsung 43” Smart UHD 4K Television","SAMSUNG","televisions",139900,159900,4.6,102,5,"tv.jpg"),
 p(16,"Welling Pedestal Fan","WELLING","home-appliances",26900,29900,4.4,76,4,"fan.jpg"),
 p(17,"Green Lion GP Ultra 5 Console","GREEN LION","gaming-consoles",169900,189900,4.9,187,3,"console.jpg"),
 p(18,"Google Stadia Bluetooth Gaming Controller","GOOGLE","gaming-accessories",19900,24900,4.6,213,16,"controller.jpg"),
 p(19,"Complete Sports Kit: Bluetooth Headphones, 500ml LED Thermal Bottle, and Smartwatch - Comfort and Style for Activities","ELECTROMART","gifts",24900,29900,4.7,122,9,"gift.jpg"),
 p(20,"Apple 40W Dynamic Power Adapter with 60W Max","APPLE","phone-accessories",10900,12900,4.4,143,0,"adapter.jpg"),
];
export const formatPrice = n => `Rs. ${Number(n).toLocaleString('en-LK')}`;
