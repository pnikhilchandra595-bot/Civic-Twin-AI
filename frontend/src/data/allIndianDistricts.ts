export interface DistrictItem {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  basin: string;
  threat?: 'CRITICAL' | 'ELEVATED' | 'MONITOR';
}

export const ALL_INDIAN_DISTRICTS: DistrictItem[] = [
  // --- TELANGANA (33 Districts) ---
  { id: "ts_hyderabad", name: "Hyderabad Metropolitan", state: "Telangana", lat: 17.3850, lng: 78.4867, basin: "Musi River & Hussain Sagar Sluice Gates", threat: "CRITICAL" },
  { id: "ts_bhadradri", name: "Bhadradri Kothagudem (Bhadrachalam)", state: "Telangana", lat: 17.6689, lng: 80.8936, basin: "Godavari 71-ft 3rd Warning Flood Mark", threat: "CRITICAL" },
  { id: "ts_hanumakonda", name: "Hanumakonda / Warangal", state: "Telangana", lat: 17.9689, lng: 79.5941, basin: "Bhadrakali & Waddepally Lake Overflow", threat: "CRITICAL" },
  { id: "ts_karimnagar", name: "Karimnagar", state: "Telangana", lat: 18.4386, lng: 79.1288, basin: "Lower Manair Dam Spillway Discharge", threat: "ELEVATED" },
  { id: "ts_khammam", name: "Khammam", state: "Telangana", lat: 17.2473, lng: 80.1514, basin: "Munneru River Severe Floodplain Inundation", threat: "CRITICAL" },
  { id: "ts_mahbubnagar", name: "Mahabubnagar", state: "Telangana", lat: 16.7488, lng: 77.9988, basin: "Krishna & Peddavagu River Catchment", threat: "MONITOR" },
  { id: "ts_medchal", name: "Medchal-Malkajgiri", state: "Telangana", lat: 17.6297, lng: 78.4814, basin: "Alwal & Kapra Lake Stormwater Drains", threat: "ELEVATED" },
  { id: "ts_nizamabad", name: "Nizamabad", state: "Telangana", lat: 18.6725, lng: 78.0941, basin: "Sriram Sagar Dam (SRSP) 42-Gate Release", threat: "CRITICAL" },
  { id: "ts_rangareddy", name: "Rangareddy", state: "Telangana", lat: 17.4399, lng: 78.4983, basin: "Himayat Sagar & Osman Sagar Spillways", threat: "CRITICAL" },
  { id: "ts_sangareddy", name: "Sangareddy", state: "Telangana", lat: 17.6193, lng: 78.0814, basin: "Manjeera Dam & Singur Reservoir", threat: "ELEVATED" },
  { id: "ts_siddipet", name: "Siddipet", state: "Telangana", lat: 18.1018, lng: 78.8520, basin: "Kaleshwaram Lift & Ranganayaka Sagar", threat: "MONITOR" },
  { id: "ts_suryapet", name: "Suryapet", state: "Telangana", lat: 17.1439, lng: 79.6239, basin: "Musi River Downstream Reach", threat: "ELEVATED" },
  { id: "ts_yadadri", name: "Yadadri Bhuvanagiri", state: "Telangana", lat: 17.5100, lng: 78.8900, basin: "Bikkeru & Musi River Basin", threat: "MONITOR" },
  { id: "ts_adilabad", name: "Adilabad", state: "Telangana", lat: 19.6641, lng: 78.5320, basin: "Penganga & Kadam Dam Spillway", threat: "ELEVATED" },
  { id: "ts_jagtial", name: "Jagtial", state: "Telangana", lat: 18.7900, lng: 78.9100, basin: "Godavari Flood Flow Canal", threat: "MONITOR" },
  { id: "ts_mancherial", name: "Mancherial", state: "Telangana", lat: 18.8679, lng: 79.4639, basin: "Godavari & Pranhita River Confluence", threat: "CRITICAL" },
  { id: "ts_peddapalli", name: "Peddapalli", state: "Telangana", lat: 18.6160, lng: 79.3820, basin: "Sundilla Barrage & Godavari Basin", threat: "ELEVATED" },

  // --- ANDHRA PRADESH (26 Districts) ---
  { id: "ap_ntr", name: "NTR (Vijayawada)", state: "Andhra Pradesh", lat: 16.5062, lng: 80.6480, basin: "Krishna Prakasam Barrage & Budameru Diversion", threat: "CRITICAL" },
  { id: "ap_visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185, basin: "Bay of Bengal Coastal Cyclone Hub", threat: "CRITICAL" },
  { id: "ap_guntur", name: "Guntur", state: "Andhra Pradesh", lat: 16.3067, lng: 80.4365, basin: "Krishna River Lower Basin", threat: "MONITOR" },
  { id: "ap_east_godavari", name: "East Godavari (Rajahmundry)", state: "Andhra Pradesh", lat: 17.0005, lng: 81.8040, basin: "Godavari Dowleswaram Barrage Discharge", threat: "CRITICAL" },
  { id: "ap_dr_br_ambedkar", name: "Dr. B.R. Ambedkar Konaseema", state: "Andhra Pradesh", lat: 16.5700, lng: 81.9900, basin: "Godavari Delta Estuary Surge", threat: "CRITICAL" },
  { id: "ap_kakinada", name: "Kakinada", state: "Andhra Pradesh", lat: 16.9891, lng: 82.2475, basin: "Bay of Bengal Coastal Cyclone Corridor", threat: "CRITICAL" },
  { id: "ap_krishna", name: "Krishna (Machilipatnam)", state: "Andhra Pradesh", lat: 16.1875, lng: 81.1389, basin: "Krishna Delta & Sea Coast Overwash", threat: "CRITICAL" },
  { id: "ap_spsr_nellore", name: "SPSR Nellore", state: "Andhra Pradesh", lat: 14.4426, lng: 79.9865, basin: "Penna River & Somasila Dam Surge", threat: "CRITICAL" },
  { id: "ap_tirupati", name: "Tirupati", state: "Andhra Pradesh", lat: 13.6288, lng: 79.4192, basin: "Swarnamukhi & Pulicat Lagoon Basin", threat: "ELEVATED" },
  { id: "ap_srikakulam", name: "Srikakulam", state: "Andhra Pradesh", lat: 18.2949, lng: 83.8938, basin: "Vamsadhara & Nagavali River Surge", threat: "CRITICAL" },
  { id: "ap_kurnool", name: "Kurnool", state: "Andhra Pradesh", lat: 15.8281, lng: 78.0373, basin: "Tungabhadra & Hundri River Confluence", threat: "ELEVATED" },
  { id: "ap_anantapur", name: "Anantapur", state: "Andhra Pradesh", lat: 14.6819, lng: 77.6006, basin: "Penna River Drought & Flash Basin", threat: "MONITOR" },

  // --- MAHARASHTRA (36 Districts) ---
  { id: "mh_mumbai_city", name: "Mumbai City (Colaba / Fort / Dadar)", state: "Maharashtra", lat: 18.9388, lng: 72.8353, basin: "Arabian Sea Coastal Surge & High Tide", threat: "CRITICAL" },
  { id: "mh_mumbai_suburban", name: "Mumbai Suburban (Kurla / Bandra / Andheri)", state: "Maharashtra", lat: 19.0760, lng: 72.8777, basin: "Mithi River & Hindmata Dadar Submergence", threat: "CRITICAL" },
  { id: "mh_thane", name: "Thane", state: "Maharashtra", lat: 19.2183, lng: 72.9781, basin: "Ulhas River, Barvi Dam & Kalwa Creek Surge", threat: "CRITICAL" },
  { id: "mh_pune", name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, basin: "Mutha River Khadakwasla Dam Spillway 35,000 cusecs", threat: "CRITICAL" },
  { id: "mh_nagpur", name: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882, basin: "Nag River, Pili River & Ambazari Lake Breach", threat: "CRITICAL" },
  { id: "mh_nashik", name: "Nashik", state: "Maharashtra", lat: 19.9975, lng: 73.7898, basin: "Godavari Gangapur Dam 15,000 Cusecs Discharge", threat: "CRITICAL" },
  { id: "mh_kolhapur", name: "Kolhapur", state: "Maharashtra", lat: 16.7050, lng: 74.2433, basin: "Panchganga River 43-ft Warning Gauge Mark", threat: "CRITICAL" },
  { id: "mh_sangli", name: "Sangli", state: "Maharashtra", lat: 16.8524, lng: 74.5815, basin: "Krishna & Warna River Irwin Bridge Red Mark", threat: "CRITICAL"},
  { id: "mh_aurangabad", name: "Chhatrapati Sambhajinagar", state: "Maharashtra", lat: 19.8762, lng: 75.3433, basin: "Godavari & Jayakwadi Dam 27-Gate Sluice", threat: "CRITICAL" },
  { id: "mh_solapur", name: "Solapur", state: "Maharashtra", lat: 17.6599, lng: 75.9064, basin: "Bhima River Ujjani Dam 100,000 Cusecs Discharge", threat: "CRITICAL" },
  { id: "mh_raigad", name: "Raigad (Alibag / Mahad)", state: "Maharashtra", lat: 18.5158, lng: 73.1812, basin: "Savitri, Kundalika & Amba River Flash Floods", threat: "CRITICAL" },
  { id: "mh_ratnagiri", name: "Ratnagiri (Chiplun)", state: "Maharashtra", lat: 16.9902, lng: 73.3120, basin: "Vashishti River Chiplun City Extreme Submergence", threat: "CRITICAL" },

  // --- DELHI NCR (11 Districts) ---
  { id: "dl_central", name: "Central Delhi (ITO / Ring Road)", state: "Delhi NCR", lat: 28.6448, lng: 77.2167, basin: "Yamuna Hathnikund Barrage 3.5 Lakh Cusecs", threat: "CRITICAL" },
  { id: "dl_east", name: "East Delhi (Mayur Vihar / Akshardham)", state: "Delhi NCR", lat: 28.6279, lng: 77.2784, basin: "Yamuna Trans-River Lowland Inundation", threat: "CRITICAL" },
  { id: "dl_north", name: "North Delhi (Kashmere Gate ISBT)", state: "Delhi NCR", lat: 28.6863, lng: 77.2218, basin: "Yamuna Old Railway Bridge Red Mark", threat: "CRITICAL" },
  { id: "dl_south", name: "South Delhi (Hauz Khas / Barapullah)", state: "Delhi NCR", lat: 28.5400, lng: 77.2000, basin: "Barapullah Drain Catchment", threat: "MONITOR" },
  { id: "dl_west", name: "West Delhi (Najafgarh Drain / Dwarka)", state: "Delhi NCR", lat: 28.6300, lng: 77.0800, basin: "Najafgarh Trunk Drain Submergence", threat: "CRITICAL" },

  // --- KARNATAKA (31 Districts) ---
  { id: "ka_bengaluru_urban", name: "Bengaluru Urban", state: "Karnataka", lat: 12.9716, lng: 77.5946, basin: "Bellandur-Varthur Lake Spillway & ORR Corridor", threat: "CRITICAL" },
  { id: "ka_dakshina_kannada", name: "Dakshina Kannada (Mangaluru)", state: "Karnataka", lat: 12.9141, lng: 74.8560, basin: "Netravati & Gurupura Estuary Surge", threat: "CRITICAL" },
  { id: "ka_kodagu", name: "Kodagu (Madikeri / Coorg)", state: "Karnataka", lat: 12.4244, lng: 75.7382, basin: "Cauvery River Headwaters Mountain Surge", threat: "CRITICAL" },
  { id: "ka_mysuru", name: "Mysuru", state: "Karnataka", lat: 12.2958, lng: 76.6394, basin: "KRS Dam 124.8-ft Maximum Sluice Discharge", threat: "CRITICAL" },
  { id: "ka_udupi", name: "Udupi", state: "Karnataka", lat: 13.3409, lng: 74.7421, basin: "Swarna & Sita River Coastal Surge", threat: "CRITICAL" },
  { id: "ka_belagavi", name: "Belagavi", state: "Karnataka", lat: 15.8497, lng: 74.4977, basin: "Krishna, Malaprabha & Hidkal Dam", threat: "CRITICAL" },

  // --- TAMIL NADU (38 Districts) ---
  { id: "tn_chennai", name: "Chennai Metropolitan", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, basin: "Adyar, Cooum, Chembarambakkam & Ennore", threat: "CRITICAL" },
  { id: "tn_coimbatore", name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558, basin: "Noyyal River & Siruvani Dam", threat: "ELEVATED" },
  { id: "tn_cuddalore", name: "Cuddalore", state: "Tamil Nadu", lat: 11.7480, lng: 79.7714, basin: "Gadilam, Pennaiyar & Bay of Bengal Cyclone Surge", threat: "CRITICAL" },
  { id: "tn_madurai", name: "Madurai", state: "Tamil Nadu", lat: 9.9252, lng: 78.1198, basin: "Vaigai River Vaigai Dam Discharge", threat: "CRITICAL" },
  { id: "tn_tiruchirappalli", name: "Tiruchirappalli", state: "Tamil Nadu", lat: 10.7905, lng: 78.7047, basin: "Cauvery & Kollidam Upper Anicut", threat: "CRITICAL" },
  { id: "tn_thanjavur", name: "Thanjavur", state: "Tamil Nadu", lat: 10.7870, lng: 79.1378, basin: "Grand Anicut (Kallanai) & Cauvery Delta", threat: "CRITICAL" },
  { id: "tn_thoothukudi", name: "Thoothukudi (Tuticorin)", state: "Tamil Nadu", lat: 8.7642, lng: 78.1348, basin: "Thamirabarani River Extreme Flood Surge", threat: "CRITICAL" },
  { id: "tn_tirunelveli", name: "Tirunelveli", state: "Tamil Nadu", lat: 8.7139, lng: 77.7567, basin: "Thamirabarani River Kokkirakulam Gauge", threat: "CRITICAL" },
  { id: "tn_nilgiris", name: "Nilgiris (Ooty)", state: "Tamil Nadu", lat: 11.4102, lng: 76.6950, basin: "Pykara & Moyar Mountain Landslide Gorge", threat: "CRITICAL" },

  // --- UTTAR PRADESH (75 Districts) ---
  { id: "up_varanasi", name: "Varanasi (Kashi)", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739, basin: "Ganga Ghats & Varuna River Backflow", threat: "CRITICAL" },
  { id: "up_prayagraj", name: "Prayagraj (Allahabad)", state: "Uttar Pradesh", lat: 25.4358, lng: 81.8463, basin: "Triveni Sangam Ganga-Yamuna Rising Mark", threat: "CRITICAL" },
  { id: "up_lucknow", name: "Lucknow Capital", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, basin: "Gomti Riverfront & Kukrail Drain", threat: "CRITICAL" },
  { id: "up_kanpur", name: "Kanpur Nagar", state: "Uttar Pradesh", lat: 26.4499, lng: 80.3319, basin: "Ganga Barrage & Pandu River", threat: "CRITICAL" },
  { id: "up_gorakhpur", name: "Gorakhpur", state: "Uttar Pradesh", lat: 26.7606, lng: 83.3732, basin: "Rapti, Rohini & Ramgarh Taal Inundation", threat: "CRITICAL" },
  { id: "up_ayodhya", name: "Ayodhya (Faizabad)", state: "Uttar Pradesh", lat: 26.7922, lng: 82.1998, basin: "Saryu / Ghaghara River Ram Ki Paidi", threat: "CRITICAL" },
  { id: "up_agra", name: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081, basin: "Yamuna River Taj Mahal Floodplain", threat: "CRITICAL" },
  { id: "up_noida", name: "Gautam Buddha Nagar (Noida)", state: "Uttar Pradesh", lat: 28.5355, lng: 77.3910, basin: "Yamuna & Hindon Floodplain Floodgates", threat: "CRITICAL" },

  // --- WEST BENGAL (23 Districts) ---
  { id: "wb_kolkata", name: "Kolkata Metropolitan", state: "West Bengal", lat: 22.5726, lng: 88.3639, basin: "Hooghly Tidal Bore & Strand Road Sluice", threat: "CRITICAL" },
  { id: "wb_south_24_pgs", name: "South 24 Parganas (Sundarbans)", state: "West Bengal", lat: 22.1352, lng: 88.5434, basin: "Sundarbans Matla & Bidyadhari Cyclone Surge", threat: "CRITICAL" },
  { id: "wb_howrah", name: "Howrah", state: "West Bengal", lat: 22.5958, lng: 88.2636, basin: "Hooghly River & Rupnarayan Basin", threat: "CRITICAL" },
  { id: "wb_darjeeling", name: "Darjeeling & Siliguri", state: "West Bengal", lat: 27.0410, lng: 88.2663, basin: "Teesta, Mahananda & Balason Torrent", threat: "CRITICAL" },

  // --- GUJARAT (33 Districts) ---
  { id: "gj_surat", name: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311, basin: "Tapi River Ukai Dam 22-Gate Sluice & High Tide", threat: "CRITICAL" },
  { id: "gj_ahmedabad", name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714, basin: "Sabarmati Riverfront & Vasna Barrage", threat: "CRITICAL" },
  { id: "gj_vadodara", name: "Vadodara", state: "Gujarat", lat: 22.3072, lng: 73.1812, basin: "Vishwamitri River Ajwa Dam Overwash", threat: "CRITICAL" },
  { id: "gj_kutch", name: "Kutch (Bhuj / Kandla Port)", state: "Gujarat", lat: 23.2420, lng: 69.6669, basin: "Gulf of Kutch Cyclone Storm Surge", threat: "CRITICAL" },

  // --- KERALA (14 Districts) ---
  { id: "kl_ernakulam", name: "Ernakulam (Kochi)", state: "Kerala", lat: 9.9312, lng: 76.2673, basin: "Periyar River Aluva & Idukki Discharge", threat: "CRITICAL" },
  { id: "kl_wayanad", name: "Wayanad (Kalpetta / Meppadi)", state: "Kerala", lat: 11.6854, lng: 76.1320, basin: "Banasura Sagar & Chooramala Landslide Zone", threat: "CRITICAL" },
  { id: "kl_alappuzha", name: "Alappuzha (Kuttanad)", state: "Kerala", lat: 9.4981, lng: 76.3388, basin: "Vembanad Lake Sub-Sea Level Basin", threat: "CRITICAL" },
  { id: "kl_idukki", name: "Idukki (Cheruthoni)", state: "Kerala", lat: 9.8500, lng: 76.9700, basin: "Idukki Arch Dam & Mullaperiyar Spillway", threat: "CRITICAL" },
  { id: "kl_thiruvananthapuram", name: "Thiruvananthapuram Capital", state: "Kerala", lat: 8.5241, lng: 76.9366, basin: "Karamana River & Aruvikkara Dam", threat: "ELEVATED" },

  // --- ASSAM (35 Districts) ---
  { id: "as_kamrup_metro", name: "Kamrup Metropolitan (Guwahati)", state: "Assam", lat: 26.1445, lng: 91.7362, basin: "Brahmaputra Main Stem & Bharalu Sluice", threat: "CRITICAL" },
  { id: "as_cachar", name: "Cachar (Silchar)", state: "Assam", lat: 24.8333, lng: 92.7789, basin: "Barak Valley Severe Inundation", threat: "CRITICAL" },
  { id: "as_dibrugarh", name: "Dibrugarh", state: "Assam", lat: 27.4728, lng: 94.9120, basin: "Brahmaputra & Burhi Dihing Floodplain", threat: "CRITICAL" },
  { id: "as_majuli", name: "Majuli Island", state: "Assam", lat: 26.9500, lng: 94.1700, basin: "World's Largest River Island Extreme Floods", threat: "CRITICAL" },

  // --- BIHAR (38 Districts) ---
  { id: "br_patna", name: "Patna Capital", state: "Bihar", lat: 25.6100, lng: 85.1400, basin: "Ganga, Son, Gandak & Punpun Quad-Confluence", threat: "CRITICAL" },
  { id: "br_darbhanga", name: "Darbhanga", state: "Bihar", lat: 26.1500, lng: 85.9000, basin: "Bagmati, Kamla Balan & Adhwara", threat: "CRITICAL" },
  { id: "br_supaul", name: "Supaul", state: "Bihar", lat: 26.1200, lng: 86.6000, basin: "Kosi Birpur Barrage 56-Gate Release", threat: "CRITICAL" },
  { id: "br_katihar", name: "Katihar", state: "Bihar", lat: 25.5400, lng: 87.5800, basin: "Mahananda, Ganga & Kosi Triple Confluence", threat: "CRITICAL" },

  // --- ODISHA (30 Districts) ---
  { id: "od_khordha", name: "Khordha (Bhubaneswar)", state: "Odisha", lat: 20.2961, lng: 85.8245, basin: "Kuakhai & Daya River Delta Basin", threat: "CRITICAL" },
  { id: "od_cuttack", name: "Cuttack", state: "Odisha", lat: 20.4625, lng: 85.8828, basin: "Mahanadi-Kathajodi Naraj Barrage", threat: "CRITICAL" },
  { id: "od_puri", name: "Puri Coastal", state: "Odisha", lat: 19.8135, lng: 85.8312, basin: "Bay of Bengal Severe Cyclone Overwash", threat: "CRITICAL" },

  // --- SIKKIM, MEGHALAYA, ARUNACHAL, LADAKH, J&K, ISLANDS ---
  { id: "sk_gangtok", name: "Gangtok", state: "Sikkim", lat: 27.3389, lng: 88.6065, basin: "Teesta Hydro Stage III & V Sluice Surge", threat: "CRITICAL" },
  { id: "ml_shillong", name: "Shillong & Cherrapunji", state: "Meghalaya", lat: 25.5788, lng: 91.8933, basin: "Khasi Hills Extreme Precipitation Basin", threat: "CRITICAL" },
  { id: "ar_papum_pare", name: "Papum Pare (Itanagar)", state: "Arunachal Pradesh", lat: 27.0844, lng: 93.6053, basin: "Dikrong River & Itanagar Cloudburst", threat: "CRITICAL" },
  { id: "la_leh", name: "Leh", state: "Ladakh", lat: 34.1526, lng: 77.5771, basin: "Indus River & Khardung Glacial Outflow", threat: "CRITICAL" },
  { id: "jk_srinagar", name: "Srinagar", state: "Jammu & Kashmir", lat: 34.0837, lng: 74.7973, basin: "Jhelum River Ram Munshi Bagh Gauge Mark", threat: "CRITICAL" },
  { id: "an_south_andaman", name: "South Andaman (Port Blair)", state: "Andaman & Nicobar", lat: 11.6234, lng: 92.7265, basin: "Bay of Bengal Island Cyclone Surge", threat: "CRITICAL" },
  { id: "ld_kavaratti", name: "Kavaratti Island", state: "Lakshadweep", lat: 10.5667, lng: 72.6417, basin: "Arabian Sea Coral Reef Overwash", threat: "CRITICAL" },
  { id: "py_puducherry", name: "Puducherry Coastal", state: "Puducherry", lat: 11.9416, lng: 79.8083, basin: "Coromandel Cyclone Storm Surge", threat: "CRITICAL" },
  { id: "ch_chandigarh", name: "Chandigarh UT", state: "Chandigarh", lat: 30.7333, lng: 76.7794, basin: "Sukhna Lake Sluice & Ghaggar Basin", threat: "MONITOR" }
];
