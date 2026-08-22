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
  {
    "id": "an_alluri_sitharama_raju",
    "name": "Alluri Sitharama Raju",
    "state": "Andhra Pradesh",
    "lat": 15.0729,
    "lng": 78.9,
    "basin": "Alluri Sitharama Raju Sub-basin & Krishna & Godavari River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "an_anakapalli",
    "name": "Anakapalli",
    "state": "Andhra Pradesh",
    "lat": 15.3529,
    "lng": 78.9,
    "basin": "Anakapalli Sub-basin & Krishna & Godavari River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "an_anantapur",
    "name": "Anantapur",
    "state": "Andhra Pradesh",
    "lat": 15.6329,
    "lng": 78.9,
    "basin": "Anantapur Sub-basin & Krishna & Godavari River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "an_annamayya",
    "name": "Annamayya",
    "state": "Andhra Pradesh",
    "lat": 15.9129,
    "lng": 78.9,
    "basin": "Annamayya Sub-basin & Krishna & Godavari River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "an_bapatla",
    "name": "Bapatla",
    "state": "Andhra Pradesh",
    "lat": 16.1929,
    "lng": 78.9,
    "basin": "Bapatla Sub-basin & Krishna & Godavari River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "an_chittoor",
    "name": "Chittoor",
    "state": "Andhra Pradesh",
    "lat": 16.4729,
    "lng": 78.9,
    "basin": "Chittoor Sub-basin & Krishna & Godavari River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "an_dr_br_ambedkar_konaseema",
    "name": "Dr. B.R. Ambedkar Konaseema",
    "state": "Andhra Pradesh",
    "lat": 16.7529,
    "lng": 78.9,
    "basin": "Dr. B.R. Ambedkar Konaseema Sub-basin & Krishna & Godavari River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "an_east_godavari",
    "name": "East Godavari",
    "state": "Andhra Pradesh",
    "lat": 15.0729,
    "lng": 79.18,
    "basin": "East Godavari Sub-basin & Krishna & Godavari River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "an_eluru",
    "name": "Eluru",
    "state": "Andhra Pradesh",
    "lat": 15.3529,
    "lng": 79.18,
    "basin": "Eluru Sub-basin & Krishna & Godavari River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "an_guntur",
    "name": "Guntur",
    "state": "Andhra Pradesh",
    "lat": 15.6329,
    "lng": 79.18,
    "basin": "Guntur Sub-basin & Krishna & Godavari River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "an_kakinada",
    "name": "Kakinada",
    "state": "Andhra Pradesh",
    "lat": 15.9129,
    "lng": 79.18,
    "basin": "Kakinada Sub-basin & Krishna & Godavari River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "an_krishna",
    "name": "Krishna",
    "state": "Andhra Pradesh",
    "lat": 16.1929,
    "lng": 79.18,
    "basin": "Krishna Sub-basin & Krishna & Godavari River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "an_kurnool",
    "name": "Kurnool",
    "state": "Andhra Pradesh",
    "lat": 16.4729,
    "lng": 79.18,
    "basin": "Kurnool Sub-basin & Krishna & Godavari River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "an_nandyal",
    "name": "Nandyal",
    "state": "Andhra Pradesh",
    "lat": 16.7529,
    "lng": 79.18,
    "basin": "Nandyal Sub-basin & Krishna & Godavari River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "an_ntr",
    "name": "NTR",
    "state": "Andhra Pradesh",
    "lat": 15.0729,
    "lng": 79.46,
    "basin": "NTR Sub-basin & Krishna & Godavari River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "an_palnadu",
    "name": "Palnadu",
    "state": "Andhra Pradesh",
    "lat": 15.3529,
    "lng": 79.46,
    "basin": "Palnadu Sub-basin & Krishna & Godavari River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "an_parvathipuram_manyam",
    "name": "Parvathipuram Manyam",
    "state": "Andhra Pradesh",
    "lat": 15.6329,
    "lng": 79.46,
    "basin": "Parvathipuram Manyam Sub-basin & Krishna & Godavari River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "an_prakasam",
    "name": "Prakasam",
    "state": "Andhra Pradesh",
    "lat": 15.9129,
    "lng": 79.46,
    "basin": "Prakasam Sub-basin & Krishna & Godavari River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "an_spsr_nellore",
    "name": "SPSR Nellore",
    "state": "Andhra Pradesh",
    "lat": 16.1929,
    "lng": 79.46,
    "basin": "SPSR Nellore Sub-basin & Krishna & Godavari River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "an_sri_sathya_sai",
    "name": "Sri Sathya Sai",
    "state": "Andhra Pradesh",
    "lat": 16.4729,
    "lng": 79.46,
    "basin": "Sri Sathya Sai Sub-basin & Krishna & Godavari River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "an_srikakulam",
    "name": "Srikakulam",
    "state": "Andhra Pradesh",
    "lat": 16.7529,
    "lng": 79.46,
    "basin": "Srikakulam Sub-basin & Krishna & Godavari River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "an_tirupati",
    "name": "Tirupati",
    "state": "Andhra Pradesh",
    "lat": 15.0729,
    "lng": 79.74,
    "basin": "Tirupati Sub-basin & Krishna & Godavari River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "an_visakhapatnam",
    "name": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "lat": 15.3529,
    "lng": 79.74,
    "basin": "Visakhapatnam Sub-basin & Krishna & Godavari River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "an_vizianagaram",
    "name": "Vizianagaram",
    "state": "Andhra Pradesh",
    "lat": 15.6329,
    "lng": 79.74,
    "basin": "Vizianagaram Sub-basin & Krishna & Godavari River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "an_west_godavari",
    "name": "West Godavari",
    "state": "Andhra Pradesh",
    "lat": 15.9129,
    "lng": 79.74,
    "basin": "West Godavari Sub-basin & Krishna & Godavari River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "an_ysr_kadapa",
    "name": "YSR Kadapa",
    "state": "Andhra Pradesh",
    "lat": 16.1929,
    "lng": 79.74,
    "basin": "YSR Kadapa Sub-basin & Krishna & Godavari River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ar_anjaw",
    "name": "Anjaw",
    "state": "Arunachal Pradesh",
    "lat": 27.378,
    "lng": 93.8878,
    "basin": "Anjaw Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ar_changlang",
    "name": "Changlang",
    "state": "Arunachal Pradesh",
    "lat": 27.658,
    "lng": 93.8878,
    "basin": "Changlang Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ar_dibang_valley",
    "name": "Dibang Valley",
    "state": "Arunachal Pradesh",
    "lat": 27.938,
    "lng": 93.8878,
    "basin": "Dibang Valley Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ar_east_kameng",
    "name": "East Kameng",
    "state": "Arunachal Pradesh",
    "lat": 28.218,
    "lng": 93.8878,
    "basin": "East Kameng Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ar_east_siang",
    "name": "East Siang",
    "state": "Arunachal Pradesh",
    "lat": 28.498,
    "lng": 93.8878,
    "basin": "East Siang Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ar_kamle",
    "name": "Kamle",
    "state": "Arunachal Pradesh",
    "lat": 28.778,
    "lng": 93.8878,
    "basin": "Kamle Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ar_kra_daadi",
    "name": "Kra Daadi",
    "state": "Arunachal Pradesh",
    "lat": 29.058,
    "lng": 93.8878,
    "basin": "Kra Daadi Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ar_kurung_kumey",
    "name": "Kurung Kumey",
    "state": "Arunachal Pradesh",
    "lat": 27.378,
    "lng": 94.1678,
    "basin": "Kurung Kumey Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ar_lepa_rada",
    "name": "Lepa Rada",
    "state": "Arunachal Pradesh",
    "lat": 27.658,
    "lng": 94.1678,
    "basin": "Lepa Rada Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ar_lohit",
    "name": "Lohit",
    "state": "Arunachal Pradesh",
    "lat": 27.938,
    "lng": 94.1678,
    "basin": "Lohit Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ar_longding",
    "name": "Longding",
    "state": "Arunachal Pradesh",
    "lat": 28.218,
    "lng": 94.1678,
    "basin": "Longding Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ar_lower_dibang_valley",
    "name": "Lower Dibang Valley",
    "state": "Arunachal Pradesh",
    "lat": 28.498,
    "lng": 94.1678,
    "basin": "Lower Dibang Valley Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ar_lower_siang",
    "name": "Lower Siang",
    "state": "Arunachal Pradesh",
    "lat": 28.778,
    "lng": 94.1678,
    "basin": "Lower Siang Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ar_lower_subansiri",
    "name": "Lower Subansiri",
    "state": "Arunachal Pradesh",
    "lat": 29.058,
    "lng": 94.1678,
    "basin": "Lower Subansiri Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ar_namsai",
    "name": "Namsai",
    "state": "Arunachal Pradesh",
    "lat": 27.378,
    "lng": 94.4478,
    "basin": "Namsai Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ar_pakke_kessang",
    "name": "Pakke Kessang",
    "state": "Arunachal Pradesh",
    "lat": 27.658,
    "lng": 94.4478,
    "basin": "Pakke Kessang Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ar_papum_pare",
    "name": "Papum Pare",
    "state": "Arunachal Pradesh",
    "lat": 27.938,
    "lng": 94.4478,
    "basin": "Papum Pare Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ar_shi_yomi",
    "name": "Shi Yomi",
    "state": "Arunachal Pradesh",
    "lat": 28.218,
    "lng": 94.4478,
    "basin": "Shi Yomi Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ar_siang",
    "name": "Siang",
    "state": "Arunachal Pradesh",
    "lat": 28.498,
    "lng": 94.4478,
    "basin": "Siang Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ar_tawang",
    "name": "Tawang",
    "state": "Arunachal Pradesh",
    "lat": 28.778,
    "lng": 94.4478,
    "basin": "Tawang Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ar_tirap",
    "name": "Tirap",
    "state": "Arunachal Pradesh",
    "lat": 29.058,
    "lng": 94.4478,
    "basin": "Tirap Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ar_upper_dibang_valley",
    "name": "Upper Dibang Valley",
    "state": "Arunachal Pradesh",
    "lat": 27.378,
    "lng": 94.7278,
    "basin": "Upper Dibang Valley Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ar_upper_siang",
    "name": "Upper Siang",
    "state": "Arunachal Pradesh",
    "lat": 27.658,
    "lng": 94.7278,
    "basin": "Upper Siang Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ar_upper_subansiri",
    "name": "Upper Subansiri",
    "state": "Arunachal Pradesh",
    "lat": 27.938,
    "lng": 94.7278,
    "basin": "Upper Subansiri Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ar_west_kameng",
    "name": "West Kameng",
    "state": "Arunachal Pradesh",
    "lat": 28.218,
    "lng": 94.7278,
    "basin": "West Kameng Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ar_west_siang",
    "name": "West Siang",
    "state": "Arunachal Pradesh",
    "lat": 28.498,
    "lng": 94.7278,
    "basin": "West Siang Sub-basin & Siang & Subansiri Glacial Basin",
    "threat": "MONITOR"
  },
  {
    "id": "as_baksa",
    "name": "Baksa",
    "state": "Assam",
    "lat": 25.3606,
    "lng": 92.0976,
    "basin": "Baksa Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "as_barpeta",
    "name": "Barpeta",
    "state": "Assam",
    "lat": 25.6406,
    "lng": 92.0976,
    "basin": "Barpeta Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "as_biswanath",
    "name": "Biswanath",
    "state": "Assam",
    "lat": 25.9206,
    "lng": 92.0976,
    "basin": "Biswanath Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "as_bongaigaon",
    "name": "Bongaigaon",
    "state": "Assam",
    "lat": 26.2006,
    "lng": 92.0976,
    "basin": "Bongaigaon Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "as_cachar",
    "name": "Cachar",
    "state": "Assam",
    "lat": 26.4806,
    "lng": 92.0976,
    "basin": "Cachar Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "as_charaideo",
    "name": "Charaideo",
    "state": "Assam",
    "lat": 26.7606,
    "lng": 92.0976,
    "basin": "Charaideo Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "as_chirang",
    "name": "Chirang",
    "state": "Assam",
    "lat": 27.0406,
    "lng": 92.0976,
    "basin": "Chirang Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "as_darrang",
    "name": "Darrang",
    "state": "Assam",
    "lat": 25.3606,
    "lng": 92.3776,
    "basin": "Darrang Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "as_dhemaji",
    "name": "Dhemaji",
    "state": "Assam",
    "lat": 25.6406,
    "lng": 92.3776,
    "basin": "Dhemaji Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "as_dhubri",
    "name": "Dhubri",
    "state": "Assam",
    "lat": 25.9206,
    "lng": 92.3776,
    "basin": "Dhubri Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "as_dibrugarh",
    "name": "Dibrugarh",
    "state": "Assam",
    "lat": 26.2006,
    "lng": 92.3776,
    "basin": "Dibrugarh Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "as_dima_hasao",
    "name": "Dima Hasao",
    "state": "Assam",
    "lat": 26.4806,
    "lng": 92.3776,
    "basin": "Dima Hasao Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "as_goalpara",
    "name": "Goalpara",
    "state": "Assam",
    "lat": 26.7606,
    "lng": 92.3776,
    "basin": "Goalpara Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "as_golaghat",
    "name": "Golaghat",
    "state": "Assam",
    "lat": 27.0406,
    "lng": 92.3776,
    "basin": "Golaghat Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "as_hailakandi",
    "name": "Hailakandi",
    "state": "Assam",
    "lat": 25.3606,
    "lng": 92.6576,
    "basin": "Hailakandi Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "as_hojai",
    "name": "Hojai",
    "state": "Assam",
    "lat": 25.6406,
    "lng": 92.6576,
    "basin": "Hojai Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "as_jorhat",
    "name": "Jorhat",
    "state": "Assam",
    "lat": 25.9206,
    "lng": 92.6576,
    "basin": "Jorhat Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "as_kamrup_metropolitan",
    "name": "Kamrup Metropolitan",
    "state": "Assam",
    "lat": 26.2006,
    "lng": 92.6576,
    "basin": "Kamrup Metropolitan Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "as_kamrup_rural",
    "name": "Kamrup Rural",
    "state": "Assam",
    "lat": 26.4806,
    "lng": 92.6576,
    "basin": "Kamrup Rural Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "as_karbi_anglong",
    "name": "Karbi Anglong",
    "state": "Assam",
    "lat": 26.7606,
    "lng": 92.6576,
    "basin": "Karbi Anglong Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "as_karimganj",
    "name": "Karimganj",
    "state": "Assam",
    "lat": 27.0406,
    "lng": 92.6576,
    "basin": "Karimganj Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "as_kokrajhar",
    "name": "Kokrajhar",
    "state": "Assam",
    "lat": 25.3606,
    "lng": 92.9376,
    "basin": "Kokrajhar Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "as_lakhimpur",
    "name": "Lakhimpur",
    "state": "Assam",
    "lat": 25.6406,
    "lng": 92.9376,
    "basin": "Lakhimpur Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "as_majuli",
    "name": "Majuli",
    "state": "Assam",
    "lat": 25.9206,
    "lng": 92.9376,
    "basin": "Majuli Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "as_morigaon",
    "name": "Morigaon",
    "state": "Assam",
    "lat": 26.2006,
    "lng": 92.9376,
    "basin": "Morigaon Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "as_nagaon",
    "name": "Nagaon",
    "state": "Assam",
    "lat": 26.4806,
    "lng": 92.9376,
    "basin": "Nagaon Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "as_nalbari",
    "name": "Nalbari",
    "state": "Assam",
    "lat": 26.7606,
    "lng": 92.9376,
    "basin": "Nalbari Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "as_sivasagar",
    "name": "Sivasagar",
    "state": "Assam",
    "lat": 27.0406,
    "lng": 92.9376,
    "basin": "Sivasagar Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "as_sonitpur",
    "name": "Sonitpur",
    "state": "Assam",
    "lat": 25.3606,
    "lng": 93.2176,
    "basin": "Sonitpur Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "as_south_salmara_mankachar",
    "name": "South Salmara-Mankachar",
    "state": "Assam",
    "lat": 25.6406,
    "lng": 93.2176,
    "basin": "South Salmara-Mankachar Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "as_tamulpur",
    "name": "Tamulpur",
    "state": "Assam",
    "lat": 25.9206,
    "lng": 93.2176,
    "basin": "Tamulpur Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "as_tinsukia",
    "name": "Tinsukia",
    "state": "Assam",
    "lat": 26.2006,
    "lng": 93.2176,
    "basin": "Tinsukia Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "as_udalguri",
    "name": "Udalguri",
    "state": "Assam",
    "lat": 26.4806,
    "lng": 93.2176,
    "basin": "Udalguri Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "as_west_karbi_anglong",
    "name": "West Karbi Anglong",
    "state": "Assam",
    "lat": 26.7606,
    "lng": 93.2176,
    "basin": "West Karbi Anglong Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "as_bajali",
    "name": "Bajali",
    "state": "Assam",
    "lat": 27.0406,
    "lng": 93.2176,
    "basin": "Bajali Sub-basin & Brahmaputra & Barak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "bi_araria",
    "name": "Araria",
    "state": "Bihar",
    "lat": 24.2561,
    "lng": 84.4731,
    "basin": "Araria Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_arwal",
    "name": "Arwal",
    "state": "Bihar",
    "lat": 24.5361,
    "lng": 84.4731,
    "basin": "Arwal Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_aurangabad",
    "name": "Aurangabad",
    "state": "Bihar",
    "lat": 24.8161,
    "lng": 84.4731,
    "basin": "Aurangabad Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_banka",
    "name": "Banka",
    "state": "Bihar",
    "lat": 25.0961,
    "lng": 84.4731,
    "basin": "Banka Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "bi_begusarai",
    "name": "Begusarai",
    "state": "Bihar",
    "lat": 25.3761,
    "lng": 84.4731,
    "basin": "Begusarai Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "bi_bhagalpur",
    "name": "Bhagalpur",
    "state": "Bihar",
    "lat": 25.6561,
    "lng": 84.4731,
    "basin": "Bhagalpur Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "bi_bhojpur",
    "name": "Bhojpur",
    "state": "Bihar",
    "lat": 25.9361,
    "lng": 84.4731,
    "basin": "Bhojpur Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "bi_buxar",
    "name": "Buxar",
    "state": "Bihar",
    "lat": 24.2561,
    "lng": 84.7531,
    "basin": "Buxar Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_darbhanga",
    "name": "Darbhanga",
    "state": "Bihar",
    "lat": 24.5361,
    "lng": 84.7531,
    "basin": "Darbhanga Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "bi_east_champaran",
    "name": "East Champaran",
    "state": "Bihar",
    "lat": 24.8161,
    "lng": 84.7531,
    "basin": "East Champaran Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "bi_gaya",
    "name": "Gaya",
    "state": "Bihar",
    "lat": 25.0961,
    "lng": 84.7531,
    "basin": "Gaya Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "bi_gopalganj",
    "name": "Gopalganj",
    "state": "Bihar",
    "lat": 25.3761,
    "lng": 84.7531,
    "basin": "Gopalganj Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "bi_jamui",
    "name": "Jamui",
    "state": "Bihar",
    "lat": 25.6561,
    "lng": 84.7531,
    "basin": "Jamui Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "bi_jehanabad",
    "name": "Jehanabad",
    "state": "Bihar",
    "lat": 25.9361,
    "lng": 84.7531,
    "basin": "Jehanabad Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "bi_kaimur",
    "name": "Kaimur",
    "state": "Bihar",
    "lat": 24.2561,
    "lng": 85.0331,
    "basin": "Kaimur Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "bi_katihar",
    "name": "Katihar",
    "state": "Bihar",
    "lat": 24.5361,
    "lng": 85.0331,
    "basin": "Katihar Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "bi_khagaria",
    "name": "Khagaria",
    "state": "Bihar",
    "lat": 24.8161,
    "lng": 85.0331,
    "basin": "Khagaria Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_kishanganj",
    "name": "Kishanganj",
    "state": "Bihar",
    "lat": 25.0961,
    "lng": 85.0331,
    "basin": "Kishanganj Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_lakhisarai",
    "name": "Lakhisarai",
    "state": "Bihar",
    "lat": 25.3761,
    "lng": 85.0331,
    "basin": "Lakhisarai Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "bi_madhepura",
    "name": "Madhepura",
    "state": "Bihar",
    "lat": 25.6561,
    "lng": 85.0331,
    "basin": "Madhepura Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "bi_madhubani",
    "name": "Madhubani",
    "state": "Bihar",
    "lat": 25.9361,
    "lng": 85.0331,
    "basin": "Madhubani Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "bi_munger",
    "name": "Munger",
    "state": "Bihar",
    "lat": 24.2561,
    "lng": 85.3131,
    "basin": "Munger Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_muzaffarpur",
    "name": "Muzaffarpur",
    "state": "Bihar",
    "lat": 24.5361,
    "lng": 85.3131,
    "basin": "Muzaffarpur Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_nalanda",
    "name": "Nalanda",
    "state": "Bihar",
    "lat": 24.8161,
    "lng": 85.3131,
    "basin": "Nalanda Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_nawada",
    "name": "Nawada",
    "state": "Bihar",
    "lat": 25.0961,
    "lng": 85.3131,
    "basin": "Nawada Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_patna",
    "name": "Patna",
    "state": "Bihar",
    "lat": 25.3761,
    "lng": 85.3131,
    "basin": "Patna Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_purnia",
    "name": "Purnia",
    "state": "Bihar",
    "lat": 25.6561,
    "lng": 85.3131,
    "basin": "Purnia Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "bi_rohtas",
    "name": "Rohtas",
    "state": "Bihar",
    "lat": 25.9361,
    "lng": 85.3131,
    "basin": "Rohtas Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_saharsa",
    "name": "Saharsa",
    "state": "Bihar",
    "lat": 24.2561,
    "lng": 85.5931,
    "basin": "Saharsa Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "bi_samastipur",
    "name": "Samastipur",
    "state": "Bihar",
    "lat": 24.5361,
    "lng": 85.5931,
    "basin": "Samastipur Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_saran",
    "name": "Saran",
    "state": "Bihar",
    "lat": 24.8161,
    "lng": 85.5931,
    "basin": "Saran Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "bi_sheikhpura",
    "name": "Sheikhpura",
    "state": "Bihar",
    "lat": 25.0961,
    "lng": 85.5931,
    "basin": "Sheikhpura Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "bi_sheohar",
    "name": "Sheohar",
    "state": "Bihar",
    "lat": 25.3761,
    "lng": 85.5931,
    "basin": "Sheohar Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_sitamarhi",
    "name": "Sitamarhi",
    "state": "Bihar",
    "lat": 25.6561,
    "lng": 85.5931,
    "basin": "Sitamarhi Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_siwan",
    "name": "Siwan",
    "state": "Bihar",
    "lat": 25.9361,
    "lng": 85.5931,
    "basin": "Siwan Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "bi_supaul",
    "name": "Supaul",
    "state": "Bihar",
    "lat": 24.2561,
    "lng": 85.8731,
    "basin": "Supaul Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "bi_vaishali",
    "name": "Vaishali",
    "state": "Bihar",
    "lat": 24.5361,
    "lng": 85.8731,
    "basin": "Vaishali Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "bi_west_champaran",
    "name": "West Champaran",
    "state": "Bihar",
    "lat": 24.8161,
    "lng": 85.8731,
    "basin": "West Champaran Sub-basin & Ganga, Kosi & Gandak River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ch_balod",
    "name": "Balod",
    "state": "Chhattisgarh",
    "lat": 20.4387,
    "lng": 81.0261,
    "basin": "Balod Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ch_baloda_bazar",
    "name": "Baloda Bazar",
    "state": "Chhattisgarh",
    "lat": 20.7187,
    "lng": 81.0261,
    "basin": "Baloda Bazar Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ch_balrampur",
    "name": "Balrampur",
    "state": "Chhattisgarh",
    "lat": 20.9987,
    "lng": 81.0261,
    "basin": "Balrampur Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ch_bastar",
    "name": "Bastar",
    "state": "Chhattisgarh",
    "lat": 21.2787,
    "lng": 81.0261,
    "basin": "Bastar Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ch_bemetara",
    "name": "Bemetara",
    "state": "Chhattisgarh",
    "lat": 21.5587,
    "lng": 81.0261,
    "basin": "Bemetara Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ch_bijapur",
    "name": "Bijapur",
    "state": "Chhattisgarh",
    "lat": 21.8387,
    "lng": 81.0261,
    "basin": "Bijapur Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ch_bilaspur",
    "name": "Bilaspur",
    "state": "Chhattisgarh",
    "lat": 22.1187,
    "lng": 81.0261,
    "basin": "Bilaspur Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ch_dantewada",
    "name": "Dantewada",
    "state": "Chhattisgarh",
    "lat": 20.4387,
    "lng": 81.3061,
    "basin": "Dantewada Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ch_dhamtari",
    "name": "Dhamtari",
    "state": "Chhattisgarh",
    "lat": 20.7187,
    "lng": 81.3061,
    "basin": "Dhamtari Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ch_durg",
    "name": "Durg",
    "state": "Chhattisgarh",
    "lat": 20.9987,
    "lng": 81.3061,
    "basin": "Durg Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ch_gariaband",
    "name": "Gariaband",
    "state": "Chhattisgarh",
    "lat": 21.2787,
    "lng": 81.3061,
    "basin": "Gariaband Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ch_gaurela_pendra_marwahi",
    "name": "Gaurela-Pendra-Marwahi",
    "state": "Chhattisgarh",
    "lat": 21.5587,
    "lng": 81.3061,
    "basin": "Gaurela-Pendra-Marwahi Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ch_janjgir_champa",
    "name": "Janjgir-Champa",
    "state": "Chhattisgarh",
    "lat": 21.8387,
    "lng": 81.3061,
    "basin": "Janjgir-Champa Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ch_jashpur",
    "name": "Jashpur",
    "state": "Chhattisgarh",
    "lat": 22.1187,
    "lng": 81.3061,
    "basin": "Jashpur Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ch_kabirdham",
    "name": "Kabirdham",
    "state": "Chhattisgarh",
    "lat": 20.4387,
    "lng": 81.5861,
    "basin": "Kabirdham Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ch_kanker",
    "name": "Kanker",
    "state": "Chhattisgarh",
    "lat": 20.7187,
    "lng": 81.5861,
    "basin": "Kanker Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ch_kondagaon",
    "name": "Kondagaon",
    "state": "Chhattisgarh",
    "lat": 20.9987,
    "lng": 81.5861,
    "basin": "Kondagaon Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ch_korba",
    "name": "Korba",
    "state": "Chhattisgarh",
    "lat": 21.2787,
    "lng": 81.5861,
    "basin": "Korba Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ch_koriya",
    "name": "Koriya",
    "state": "Chhattisgarh",
    "lat": 21.5587,
    "lng": 81.5861,
    "basin": "Koriya Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ch_mahasamund",
    "name": "Mahasamund",
    "state": "Chhattisgarh",
    "lat": 21.8387,
    "lng": 81.5861,
    "basin": "Mahasamund Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ch_manendragarh_chirmiri_bharatpur",
    "name": "Manendragarh-Chirmiri-Bharatpur",
    "state": "Chhattisgarh",
    "lat": 22.1187,
    "lng": 81.5861,
    "basin": "Manendragarh-Chirmiri-Bharatpur Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ch_mohla_manpur_ambagarh_chowki",
    "name": "Mohla-Manpur-Ambagarh Chowki",
    "state": "Chhattisgarh",
    "lat": 20.4387,
    "lng": 81.8661,
    "basin": "Mohla-Manpur-Ambagarh Chowki Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ch_mungeli",
    "name": "Mungeli",
    "state": "Chhattisgarh",
    "lat": 20.7187,
    "lng": 81.8661,
    "basin": "Mungeli Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ch_narayanpur",
    "name": "Narayanpur",
    "state": "Chhattisgarh",
    "lat": 20.9987,
    "lng": 81.8661,
    "basin": "Narayanpur Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ch_raigarh",
    "name": "Raigarh",
    "state": "Chhattisgarh",
    "lat": 21.2787,
    "lng": 81.8661,
    "basin": "Raigarh Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ch_raipur",
    "name": "Raipur",
    "state": "Chhattisgarh",
    "lat": 21.5587,
    "lng": 81.8661,
    "basin": "Raipur Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ch_rajnandgaon",
    "name": "Rajnandgaon",
    "state": "Chhattisgarh",
    "lat": 21.8387,
    "lng": 81.8661,
    "basin": "Rajnandgaon Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ch_sarangarh_bilaigarh",
    "name": "Sarangarh-Bilaigarh",
    "state": "Chhattisgarh",
    "lat": 22.1187,
    "lng": 81.8661,
    "basin": "Sarangarh-Bilaigarh Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ch_sakti",
    "name": "Sakti",
    "state": "Chhattisgarh",
    "lat": 20.4387,
    "lng": 82.1461,
    "basin": "Sakti Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ch_sukma",
    "name": "Sukma",
    "state": "Chhattisgarh",
    "lat": 20.7187,
    "lng": 82.1461,
    "basin": "Sukma Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ch_surajpur",
    "name": "Surajpur",
    "state": "Chhattisgarh",
    "lat": 20.9987,
    "lng": 82.1461,
    "basin": "Surajpur Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ch_surguja",
    "name": "Surguja",
    "state": "Chhattisgarh",
    "lat": 21.2787,
    "lng": 82.1461,
    "basin": "Surguja Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ch_khairagarh_chhuikhadan_gandai",
    "name": "Khairagarh-Chhuikhadan-Gandai",
    "state": "Chhattisgarh",
    "lat": 21.5587,
    "lng": 82.1461,
    "basin": "Khairagarh-Chhuikhadan-Gandai Sub-basin & Mahanadi & Hasdeo River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "go_north_goa",
    "name": "North Goa",
    "state": "Goa",
    "lat": 14.4593,
    "lng": 73.284,
    "basin": "North Goa Sub-basin & Mandovi & Zuari Coastal Estuary",
    "threat": "CRITICAL"
  },
  {
    "id": "go_south_goa",
    "name": "South Goa",
    "state": "Goa",
    "lat": 14.7393,
    "lng": 73.284,
    "basin": "South Goa Sub-basin & Mandovi & Zuari Coastal Estuary",
    "threat": "ELEVATED"
  },
  {
    "id": "gu_ahmedabad",
    "name": "Ahmedabad",
    "state": "Gujarat",
    "lat": 21.4187,
    "lng": 70.3524,
    "basin": "Ahmedabad Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "gu_amreli",
    "name": "Amreli",
    "state": "Gujarat",
    "lat": 21.6987,
    "lng": 70.3524,
    "basin": "Amreli Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "gu_anand",
    "name": "Anand",
    "state": "Gujarat",
    "lat": 21.9787,
    "lng": 70.3524,
    "basin": "Anand Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "gu_aravalli",
    "name": "Aravalli",
    "state": "Gujarat",
    "lat": 22.2587,
    "lng": 70.3524,
    "basin": "Aravalli Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "MONITOR"
  },
  {
    "id": "gu_banaskantha",
    "name": "Banaskantha",
    "state": "Gujarat",
    "lat": 22.5387,
    "lng": 70.3524,
    "basin": "Banaskantha Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "gu_bharuch",
    "name": "Bharuch",
    "state": "Gujarat",
    "lat": 22.8187,
    "lng": 70.3524,
    "basin": "Bharuch Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "gu_bhavnagar",
    "name": "Bhavnagar",
    "state": "Gujarat",
    "lat": 23.0987,
    "lng": 70.3524,
    "basin": "Bhavnagar Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "gu_botad",
    "name": "Botad",
    "state": "Gujarat",
    "lat": 21.4187,
    "lng": 70.6324,
    "basin": "Botad Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "gu_chhota_udaipur",
    "name": "Chhota Udaipur",
    "state": "Gujarat",
    "lat": 21.6987,
    "lng": 70.6324,
    "basin": "Chhota Udaipur Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "gu_dahod",
    "name": "Dahod",
    "state": "Gujarat",
    "lat": 21.9787,
    "lng": 70.6324,
    "basin": "Dahod Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "MONITOR"
  },
  {
    "id": "gu_dang",
    "name": "Dang",
    "state": "Gujarat",
    "lat": 22.2587,
    "lng": 70.6324,
    "basin": "Dang Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "MONITOR"
  },
  {
    "id": "gu_devbhoomi_dwarka",
    "name": "Devbhoomi Dwarka",
    "state": "Gujarat",
    "lat": 22.5387,
    "lng": 70.6324,
    "basin": "Devbhoomi Dwarka Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "gu_gandhinagar",
    "name": "Gandhinagar",
    "state": "Gujarat",
    "lat": 22.8187,
    "lng": 70.6324,
    "basin": "Gandhinagar Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "MONITOR"
  },
  {
    "id": "gu_gir_somnath",
    "name": "Gir Somnath",
    "state": "Gujarat",
    "lat": 23.0987,
    "lng": 70.6324,
    "basin": "Gir Somnath Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "gu_jamnagar",
    "name": "Jamnagar",
    "state": "Gujarat",
    "lat": 21.4187,
    "lng": 70.9124,
    "basin": "Jamnagar Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "gu_junagadh",
    "name": "Junagadh",
    "state": "Gujarat",
    "lat": 21.6987,
    "lng": 70.9124,
    "basin": "Junagadh Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "MONITOR"
  },
  {
    "id": "gu_kheda",
    "name": "Kheda",
    "state": "Gujarat",
    "lat": 21.9787,
    "lng": 70.9124,
    "basin": "Kheda Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "gu_kutch",
    "name": "Kutch",
    "state": "Gujarat",
    "lat": 22.2587,
    "lng": 70.9124,
    "basin": "Kutch Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "gu_mahisagar",
    "name": "Mahisagar",
    "state": "Gujarat",
    "lat": 22.5387,
    "lng": 70.9124,
    "basin": "Mahisagar Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "gu_mehsana",
    "name": "Mehsana",
    "state": "Gujarat",
    "lat": 22.8187,
    "lng": 70.9124,
    "basin": "Mehsana Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "MONITOR"
  },
  {
    "id": "gu_morbi",
    "name": "Morbi",
    "state": "Gujarat",
    "lat": 23.0987,
    "lng": 70.9124,
    "basin": "Morbi Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "gu_narmada",
    "name": "Narmada",
    "state": "Gujarat",
    "lat": 21.4187,
    "lng": 71.1924,
    "basin": "Narmada Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "gu_navsari",
    "name": "Navsari",
    "state": "Gujarat",
    "lat": 21.6987,
    "lng": 71.1924,
    "basin": "Navsari Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "MONITOR"
  },
  {
    "id": "gu_panchmahal",
    "name": "Panchmahal",
    "state": "Gujarat",
    "lat": 21.9787,
    "lng": 71.1924,
    "basin": "Panchmahal Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "gu_patan",
    "name": "Patan",
    "state": "Gujarat",
    "lat": 22.2587,
    "lng": 71.1924,
    "basin": "Patan Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "MONITOR"
  },
  {
    "id": "gu_porbandar",
    "name": "Porbandar",
    "state": "Gujarat",
    "lat": 22.5387,
    "lng": 71.1924,
    "basin": "Porbandar Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "gu_rajkot",
    "name": "Rajkot",
    "state": "Gujarat",
    "lat": 22.8187,
    "lng": 71.1924,
    "basin": "Rajkot Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "MONITOR"
  },
  {
    "id": "gu_sabarkantha",
    "name": "Sabarkantha",
    "state": "Gujarat",
    "lat": 23.0987,
    "lng": 71.1924,
    "basin": "Sabarkantha Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "MONITOR"
  },
  {
    "id": "gu_surat",
    "name": "Surat",
    "state": "Gujarat",
    "lat": 21.4187,
    "lng": 71.4724,
    "basin": "Surat Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "gu_surendranagar",
    "name": "Surendranagar",
    "state": "Gujarat",
    "lat": 21.6987,
    "lng": 71.4724,
    "basin": "Surendranagar Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "gu_tapi",
    "name": "Tapi",
    "state": "Gujarat",
    "lat": 21.9787,
    "lng": 71.4724,
    "basin": "Tapi Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "gu_vadodara",
    "name": "Vadodara",
    "state": "Gujarat",
    "lat": 22.2587,
    "lng": 71.4724,
    "basin": "Vadodara Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "gu_valsad",
    "name": "Valsad",
    "state": "Gujarat",
    "lat": 22.5387,
    "lng": 71.4724,
    "basin": "Valsad Sub-basin & Tapi, Narmada & Sabarmati Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ha_ambala",
    "name": "Ambala",
    "state": "Haryana",
    "lat": 28.2188,
    "lng": 75.2456,
    "basin": "Ambala Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "ha_bhiwani",
    "name": "Bhiwani",
    "state": "Haryana",
    "lat": 28.4988,
    "lng": 75.2456,
    "basin": "Bhiwani Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "ha_charkhi_dadri",
    "name": "Charkhi Dadri",
    "state": "Haryana",
    "lat": 28.7788,
    "lng": 75.2456,
    "basin": "Charkhi Dadri Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "ha_faridabad",
    "name": "Faridabad",
    "state": "Haryana",
    "lat": 29.0588,
    "lng": 75.2456,
    "basin": "Faridabad Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "ha_fatehabad",
    "name": "Fatehabad",
    "state": "Haryana",
    "lat": 29.3388,
    "lng": 75.2456,
    "basin": "Fatehabad Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "ELEVATED"
  },
  {
    "id": "ha_gurugram",
    "name": "Gurugram",
    "state": "Haryana",
    "lat": 29.6188,
    "lng": 75.2456,
    "basin": "Gurugram Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "ELEVATED"
  },
  {
    "id": "ha_hisar",
    "name": "Hisar",
    "state": "Haryana",
    "lat": 29.8988,
    "lng": 75.2456,
    "basin": "Hisar Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "ha_jhajjar",
    "name": "Jhajjar",
    "state": "Haryana",
    "lat": 28.2188,
    "lng": 75.5256,
    "basin": "Jhajjar Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "ha_jind",
    "name": "Jind",
    "state": "Haryana",
    "lat": 28.4988,
    "lng": 75.5256,
    "basin": "Jind Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "ha_kaithal",
    "name": "Kaithal",
    "state": "Haryana",
    "lat": 28.7788,
    "lng": 75.5256,
    "basin": "Kaithal Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "ELEVATED"
  },
  {
    "id": "ha_karnal",
    "name": "Karnal",
    "state": "Haryana",
    "lat": 29.0588,
    "lng": 75.5256,
    "basin": "Karnal Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "ELEVATED"
  },
  {
    "id": "ha_kurukshetra",
    "name": "Kurukshetra",
    "state": "Haryana",
    "lat": 29.3388,
    "lng": 75.5256,
    "basin": "Kurukshetra Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "ELEVATED"
  },
  {
    "id": "ha_mahendragarh",
    "name": "Mahendragarh",
    "state": "Haryana",
    "lat": 29.6188,
    "lng": 75.5256,
    "basin": "Mahendragarh Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "ha_nuh",
    "name": "Nuh",
    "state": "Haryana",
    "lat": 29.8988,
    "lng": 75.5256,
    "basin": "Nuh Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "ELEVATED"
  },
  {
    "id": "ha_palwal",
    "name": "Palwal",
    "state": "Haryana",
    "lat": 28.2188,
    "lng": 75.8056,
    "basin": "Palwal Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "ha_panchkula",
    "name": "Panchkula",
    "state": "Haryana",
    "lat": 28.4988,
    "lng": 75.8056,
    "basin": "Panchkula Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "ha_panipat",
    "name": "Panipat",
    "state": "Haryana",
    "lat": 28.7788,
    "lng": 75.8056,
    "basin": "Panipat Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "ha_rewari",
    "name": "Rewari",
    "state": "Haryana",
    "lat": 29.0588,
    "lng": 75.8056,
    "basin": "Rewari Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "ha_rohtak",
    "name": "Rohtak",
    "state": "Haryana",
    "lat": 29.3388,
    "lng": 75.8056,
    "basin": "Rohtak Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "ha_sirsa",
    "name": "Sirsa",
    "state": "Haryana",
    "lat": 29.6188,
    "lng": 75.8056,
    "basin": "Sirsa Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "ha_sonipat",
    "name": "Sonipat",
    "state": "Haryana",
    "lat": 29.8988,
    "lng": 75.8056,
    "basin": "Sonipat Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "ha_yamunanagar",
    "name": "Yamunanagar",
    "state": "Haryana",
    "lat": 28.2188,
    "lng": 76.0856,
    "basin": "Yamunanagar Sub-basin & Ghaggar & Yamuna Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "hi_bilaspur",
    "name": "Bilaspur",
    "state": "Himachal Pradesh",
    "lat": 30.2648,
    "lng": 76.3334,
    "basin": "Bilaspur Sub-basin & Beas, Sutlej & Chenab Gorge",
    "threat": "MONITOR"
  },
  {
    "id": "hi_chamba",
    "name": "Chamba",
    "state": "Himachal Pradesh",
    "lat": 30.5448,
    "lng": 76.3334,
    "basin": "Chamba Sub-basin & Beas, Sutlej & Chenab Gorge",
    "threat": "ELEVATED"
  },
  {
    "id": "hi_hamirpur",
    "name": "Hamirpur",
    "state": "Himachal Pradesh",
    "lat": 30.8248,
    "lng": 76.3334,
    "basin": "Hamirpur Sub-basin & Beas, Sutlej & Chenab Gorge",
    "threat": "ELEVATED"
  },
  {
    "id": "hi_kangra",
    "name": "Kangra",
    "state": "Himachal Pradesh",
    "lat": 31.1048,
    "lng": 76.3334,
    "basin": "Kangra Sub-basin & Beas, Sutlej & Chenab Gorge",
    "threat": "CRITICAL"
  },
  {
    "id": "hi_kinnaur",
    "name": "Kinnaur",
    "state": "Himachal Pradesh",
    "lat": 31.3848,
    "lng": 76.3334,
    "basin": "Kinnaur Sub-basin & Beas, Sutlej & Chenab Gorge",
    "threat": "MONITOR"
  },
  {
    "id": "hi_kullu",
    "name": "Kullu",
    "state": "Himachal Pradesh",
    "lat": 31.6648,
    "lng": 76.3334,
    "basin": "Kullu Sub-basin & Beas, Sutlej & Chenab Gorge",
    "threat": "ELEVATED"
  },
  {
    "id": "hi_lahaul_and_spiti",
    "name": "Lahaul and Spiti",
    "state": "Himachal Pradesh",
    "lat": 31.9448,
    "lng": 76.3334,
    "basin": "Lahaul and Spiti Sub-basin & Beas, Sutlej & Chenab Gorge",
    "threat": "ELEVATED"
  },
  {
    "id": "hi_mandi",
    "name": "Mandi",
    "state": "Himachal Pradesh",
    "lat": 30.2648,
    "lng": 76.6134,
    "basin": "Mandi Sub-basin & Beas, Sutlej & Chenab Gorge",
    "threat": "CRITICAL"
  },
  {
    "id": "hi_shimla",
    "name": "Shimla",
    "state": "Himachal Pradesh",
    "lat": 30.5448,
    "lng": 76.6134,
    "basin": "Shimla Sub-basin & Beas, Sutlej & Chenab Gorge",
    "threat": "MONITOR"
  },
  {
    "id": "hi_sirmaur",
    "name": "Sirmaur",
    "state": "Himachal Pradesh",
    "lat": 30.8248,
    "lng": 76.6134,
    "basin": "Sirmaur Sub-basin & Beas, Sutlej & Chenab Gorge",
    "threat": "ELEVATED"
  },
  {
    "id": "hi_solan",
    "name": "Solan",
    "state": "Himachal Pradesh",
    "lat": 31.1048,
    "lng": 76.6134,
    "basin": "Solan Sub-basin & Beas, Sutlej & Chenab Gorge",
    "threat": "CRITICAL"
  },
  {
    "id": "hi_una",
    "name": "Una",
    "state": "Himachal Pradesh",
    "lat": 31.3848,
    "lng": 76.6134,
    "basin": "Una Sub-basin & Beas, Sutlej & Chenab Gorge",
    "threat": "MONITOR"
  },
  {
    "id": "jh_bokaro",
    "name": "Bokaro",
    "state": "Jharkhand",
    "lat": 22.7702,
    "lng": 84.4399,
    "basin": "Bokaro Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "jh_chatra",
    "name": "Chatra",
    "state": "Jharkhand",
    "lat": 23.0502,
    "lng": 84.4399,
    "basin": "Chatra Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "jh_deoghar",
    "name": "Deoghar",
    "state": "Jharkhand",
    "lat": 23.3302,
    "lng": 84.4399,
    "basin": "Deoghar Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "jh_dhanbad",
    "name": "Dhanbad",
    "state": "Jharkhand",
    "lat": 23.6102,
    "lng": 84.4399,
    "basin": "Dhanbad Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "jh_dumka",
    "name": "Dumka",
    "state": "Jharkhand",
    "lat": 23.8902,
    "lng": 84.4399,
    "basin": "Dumka Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "jh_east_singhbhum",
    "name": "East Singhbhum",
    "state": "Jharkhand",
    "lat": 24.1702,
    "lng": 84.4399,
    "basin": "East Singhbhum Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "jh_garhwa",
    "name": "Garhwa",
    "state": "Jharkhand",
    "lat": 24.4502,
    "lng": 84.4399,
    "basin": "Garhwa Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "jh_giridih",
    "name": "Giridih",
    "state": "Jharkhand",
    "lat": 22.7702,
    "lng": 84.7199,
    "basin": "Giridih Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "MONITOR"
  },
  {
    "id": "jh_godda",
    "name": "Godda",
    "state": "Jharkhand",
    "lat": 23.0502,
    "lng": 84.7199,
    "basin": "Godda Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "jh_gumla",
    "name": "Gumla",
    "state": "Jharkhand",
    "lat": 23.3302,
    "lng": 84.7199,
    "basin": "Gumla Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "MONITOR"
  },
  {
    "id": "jh_hazaribagh",
    "name": "Hazaribagh",
    "state": "Jharkhand",
    "lat": 23.6102,
    "lng": 84.7199,
    "basin": "Hazaribagh Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "MONITOR"
  },
  {
    "id": "jh_jamtara",
    "name": "Jamtara",
    "state": "Jharkhand",
    "lat": 23.8902,
    "lng": 84.7199,
    "basin": "Jamtara Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "jh_khunti",
    "name": "Khunti",
    "state": "Jharkhand",
    "lat": 24.1702,
    "lng": 84.7199,
    "basin": "Khunti Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "jh_koderma",
    "name": "Koderma",
    "state": "Jharkhand",
    "lat": 24.4502,
    "lng": 84.7199,
    "basin": "Koderma Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "MONITOR"
  },
  {
    "id": "jh_latehar",
    "name": "Latehar",
    "state": "Jharkhand",
    "lat": 22.7702,
    "lng": 84.9999,
    "basin": "Latehar Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "jh_lohardaga",
    "name": "Lohardaga",
    "state": "Jharkhand",
    "lat": 23.0502,
    "lng": 84.9999,
    "basin": "Lohardaga Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "jh_pakur",
    "name": "Pakur",
    "state": "Jharkhand",
    "lat": 23.3302,
    "lng": 84.9999,
    "basin": "Pakur Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "jh_palamu",
    "name": "Palamu",
    "state": "Jharkhand",
    "lat": 23.6102,
    "lng": 84.9999,
    "basin": "Palamu Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "MONITOR"
  },
  {
    "id": "jh_ramgarh",
    "name": "Ramgarh",
    "state": "Jharkhand",
    "lat": 23.8902,
    "lng": 84.9999,
    "basin": "Ramgarh Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "jh_ranchi",
    "name": "Ranchi",
    "state": "Jharkhand",
    "lat": 24.1702,
    "lng": 84.9999,
    "basin": "Ranchi Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "jh_sahibganj",
    "name": "Sahibganj",
    "state": "Jharkhand",
    "lat": 24.4502,
    "lng": 84.9999,
    "basin": "Sahibganj Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "MONITOR"
  },
  {
    "id": "jh_seraikela_kharsawan",
    "name": "Seraikela Kharsawan",
    "state": "Jharkhand",
    "lat": 22.7702,
    "lng": 85.2799,
    "basin": "Seraikela Kharsawan Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "jh_simdega",
    "name": "Simdega",
    "state": "Jharkhand",
    "lat": 23.0502,
    "lng": 85.2799,
    "basin": "Simdega Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "MONITOR"
  },
  {
    "id": "jh_west_singhbhum",
    "name": "West Singhbhum",
    "state": "Jharkhand",
    "lat": 23.3302,
    "lng": 85.2799,
    "basin": "West Singhbhum Sub-basin & Subarnarekha & Damodar Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ka_bagalkote",
    "name": "Bagalkote",
    "state": "Karnataka",
    "lat": 14.4773,
    "lng": 74.8739,
    "basin": "Bagalkote Sub-basin & Krishna & Cauvery River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ka_ballari",
    "name": "Ballari",
    "state": "Karnataka",
    "lat": 14.7573,
    "lng": 74.8739,
    "basin": "Ballari Sub-basin & Krishna & Cauvery River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ka_belagavi",
    "name": "Belagavi",
    "state": "Karnataka",
    "lat": 15.0373,
    "lng": 74.8739,
    "basin": "Belagavi Sub-basin & Krishna & Cauvery River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ka_bengaluru_rural",
    "name": "Bengaluru Rural",
    "state": "Karnataka",
    "lat": 15.3173,
    "lng": 74.8739,
    "basin": "Bengaluru Rural Sub-basin & Krishna & Cauvery River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ka_bengaluru_urban",
    "name": "Bengaluru Urban",
    "state": "Karnataka",
    "lat": 15.5973,
    "lng": 74.8739,
    "basin": "Bengaluru Urban Sub-basin & Krishna & Cauvery River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ka_bidar",
    "name": "Bidar",
    "state": "Karnataka",
    "lat": 15.8773,
    "lng": 74.8739,
    "basin": "Bidar Sub-basin & Krishna & Cauvery River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ka_chamarajanagara",
    "name": "Chamarajanagara",
    "state": "Karnataka",
    "lat": 16.1573,
    "lng": 74.8739,
    "basin": "Chamarajanagara Sub-basin & Krishna & Cauvery River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ka_chikkaballapura",
    "name": "Chikkaballapura",
    "state": "Karnataka",
    "lat": 14.4773,
    "lng": 75.1539,
    "basin": "Chikkaballapura Sub-basin & Krishna & Cauvery River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ka_chikkamagaluru",
    "name": "Chikkamagaluru",
    "state": "Karnataka",
    "lat": 14.7573,
    "lng": 75.1539,
    "basin": "Chikkamagaluru Sub-basin & Krishna & Cauvery River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ka_chitradurga",
    "name": "Chitradurga",
    "state": "Karnataka",
    "lat": 15.0373,
    "lng": 75.1539,
    "basin": "Chitradurga Sub-basin & Krishna & Cauvery River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ka_dakshina_kannada",
    "name": "Dakshina Kannada",
    "state": "Karnataka",
    "lat": 15.3173,
    "lng": 75.1539,
    "basin": "Dakshina Kannada Sub-basin & Krishna & Cauvery River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ka_davanagere",
    "name": "Davanagere",
    "state": "Karnataka",
    "lat": 15.5973,
    "lng": 75.1539,
    "basin": "Davanagere Sub-basin & Krishna & Cauvery River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ka_dharwad",
    "name": "Dharwad",
    "state": "Karnataka",
    "lat": 15.8773,
    "lng": 75.1539,
    "basin": "Dharwad Sub-basin & Krishna & Cauvery River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ka_gadag",
    "name": "Gadag",
    "state": "Karnataka",
    "lat": 16.1573,
    "lng": 75.1539,
    "basin": "Gadag Sub-basin & Krishna & Cauvery River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ka_hassan",
    "name": "Hassan",
    "state": "Karnataka",
    "lat": 14.4773,
    "lng": 75.4339,
    "basin": "Hassan Sub-basin & Krishna & Cauvery River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ka_haveri",
    "name": "Haveri",
    "state": "Karnataka",
    "lat": 14.7573,
    "lng": 75.4339,
    "basin": "Haveri Sub-basin & Krishna & Cauvery River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ka_kalaburagi",
    "name": "Kalaburagi",
    "state": "Karnataka",
    "lat": 15.0373,
    "lng": 75.4339,
    "basin": "Kalaburagi Sub-basin & Krishna & Cauvery River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ka_kodagu",
    "name": "Kodagu",
    "state": "Karnataka",
    "lat": 15.3173,
    "lng": 75.4339,
    "basin": "Kodagu Sub-basin & Krishna & Cauvery River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ka_kolar",
    "name": "Kolar",
    "state": "Karnataka",
    "lat": 15.5973,
    "lng": 75.4339,
    "basin": "Kolar Sub-basin & Krishna & Cauvery River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ka_koppal",
    "name": "Koppal",
    "state": "Karnataka",
    "lat": 15.8773,
    "lng": 75.4339,
    "basin": "Koppal Sub-basin & Krishna & Cauvery River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ka_mandya",
    "name": "Mandya",
    "state": "Karnataka",
    "lat": 16.1573,
    "lng": 75.4339,
    "basin": "Mandya Sub-basin & Krishna & Cauvery River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ka_mysuru",
    "name": "Mysuru",
    "state": "Karnataka",
    "lat": 14.4773,
    "lng": 75.7139,
    "basin": "Mysuru Sub-basin & Krishna & Cauvery River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ka_raichur",
    "name": "Raichur",
    "state": "Karnataka",
    "lat": 14.7573,
    "lng": 75.7139,
    "basin": "Raichur Sub-basin & Krishna & Cauvery River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ka_ramanagara",
    "name": "Ramanagara",
    "state": "Karnataka",
    "lat": 15.0373,
    "lng": 75.7139,
    "basin": "Ramanagara Sub-basin & Krishna & Cauvery River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ka_shivamogga",
    "name": "Shivamogga",
    "state": "Karnataka",
    "lat": 15.3173,
    "lng": 75.7139,
    "basin": "Shivamogga Sub-basin & Krishna & Cauvery River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ka_tumakuru",
    "name": "Tumakuru",
    "state": "Karnataka",
    "lat": 15.5973,
    "lng": 75.7139,
    "basin": "Tumakuru Sub-basin & Krishna & Cauvery River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ka_udupi",
    "name": "Udupi",
    "state": "Karnataka",
    "lat": 15.8773,
    "lng": 75.7139,
    "basin": "Udupi Sub-basin & Krishna & Cauvery River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ka_uttara_kannada",
    "name": "Uttara Kannada",
    "state": "Karnataka",
    "lat": 16.1573,
    "lng": 75.7139,
    "basin": "Uttara Kannada Sub-basin & Krishna & Cauvery River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ka_vijayanagara",
    "name": "Vijayanagara",
    "state": "Karnataka",
    "lat": 14.4773,
    "lng": 75.9939,
    "basin": "Vijayanagara Sub-basin & Krishna & Cauvery River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ka_vijayapura",
    "name": "Vijayapura",
    "state": "Karnataka",
    "lat": 14.7573,
    "lng": 75.9939,
    "basin": "Vijayapura Sub-basin & Krishna & Cauvery River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ka_yadgir",
    "name": "Yadgir",
    "state": "Karnataka",
    "lat": 15.0373,
    "lng": 75.9939,
    "basin": "Yadgir Sub-basin & Krishna & Cauvery River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ke_alappuzha",
    "name": "Alappuzha",
    "state": "Kerala",
    "lat": 10.0105,
    "lng": 75.4311,
    "basin": "Alappuzha Sub-basin & Periyar, Pamba & Bharathapuzha Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ke_ernakulam",
    "name": "Ernakulam",
    "state": "Kerala",
    "lat": 10.2905,
    "lng": 75.4311,
    "basin": "Ernakulam Sub-basin & Periyar, Pamba & Bharathapuzha Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ke_idukki",
    "name": "Idukki",
    "state": "Kerala",
    "lat": 10.5705,
    "lng": 75.4311,
    "basin": "Idukki Sub-basin & Periyar, Pamba & Bharathapuzha Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ke_kannur",
    "name": "Kannur",
    "state": "Kerala",
    "lat": 10.8505,
    "lng": 75.4311,
    "basin": "Kannur Sub-basin & Periyar, Pamba & Bharathapuzha Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ke_kasaragod",
    "name": "Kasaragod",
    "state": "Kerala",
    "lat": 11.1305,
    "lng": 75.4311,
    "basin": "Kasaragod Sub-basin & Periyar, Pamba & Bharathapuzha Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ke_kollam",
    "name": "Kollam",
    "state": "Kerala",
    "lat": 11.4105,
    "lng": 75.4311,
    "basin": "Kollam Sub-basin & Periyar, Pamba & Bharathapuzha Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ke_kottayam",
    "name": "Kottayam",
    "state": "Kerala",
    "lat": 11.6905,
    "lng": 75.4311,
    "basin": "Kottayam Sub-basin & Periyar, Pamba & Bharathapuzha Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ke_kozhikode",
    "name": "Kozhikode",
    "state": "Kerala",
    "lat": 10.0105,
    "lng": 75.7111,
    "basin": "Kozhikode Sub-basin & Periyar, Pamba & Bharathapuzha Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ke_malappuram",
    "name": "Malappuram",
    "state": "Kerala",
    "lat": 10.2905,
    "lng": 75.7111,
    "basin": "Malappuram Sub-basin & Periyar, Pamba & Bharathapuzha Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ke_palakkad",
    "name": "Palakkad",
    "state": "Kerala",
    "lat": 10.5705,
    "lng": 75.7111,
    "basin": "Palakkad Sub-basin & Periyar, Pamba & Bharathapuzha Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ke_pathanamthitta",
    "name": "Pathanamthitta",
    "state": "Kerala",
    "lat": 10.8505,
    "lng": 75.7111,
    "basin": "Pathanamthitta Sub-basin & Periyar, Pamba & Bharathapuzha Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ke_thiruvananthapuram",
    "name": "Thiruvananthapuram",
    "state": "Kerala",
    "lat": 11.1305,
    "lng": 75.7111,
    "basin": "Thiruvananthapuram Sub-basin & Periyar, Pamba & Bharathapuzha Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ke_thrissur",
    "name": "Thrissur",
    "state": "Kerala",
    "lat": 11.4105,
    "lng": 75.7111,
    "basin": "Thrissur Sub-basin & Periyar, Pamba & Bharathapuzha Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ke_wayanad",
    "name": "Wayanad",
    "state": "Kerala",
    "lat": 11.6905,
    "lng": 75.7111,
    "basin": "Wayanad Sub-basin & Periyar, Pamba & Bharathapuzha Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_agar_malwa",
    "name": "Agar Malwa",
    "state": "Madhya Pradesh",
    "lat": 22.1334,
    "lng": 77.8169,
    "basin": "Agar Malwa Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_alirajpur",
    "name": "Alirajpur",
    "state": "Madhya Pradesh",
    "lat": 22.4134,
    "lng": 77.8169,
    "basin": "Alirajpur Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_anuppur",
    "name": "Anuppur",
    "state": "Madhya Pradesh",
    "lat": 22.6934,
    "lng": 77.8169,
    "basin": "Anuppur Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_ashoknagar",
    "name": "Ashoknagar",
    "state": "Madhya Pradesh",
    "lat": 22.9734,
    "lng": 77.8169,
    "basin": "Ashoknagar Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_balaghat",
    "name": "Balaghat",
    "state": "Madhya Pradesh",
    "lat": 23.2534,
    "lng": 77.8169,
    "basin": "Balaghat Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_barwani",
    "name": "Barwani",
    "state": "Madhya Pradesh",
    "lat": 23.5334,
    "lng": 77.8169,
    "basin": "Barwani Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_betul",
    "name": "Betul",
    "state": "Madhya Pradesh",
    "lat": 23.8134,
    "lng": 77.8169,
    "basin": "Betul Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_bhind",
    "name": "Bhind",
    "state": "Madhya Pradesh",
    "lat": 22.1334,
    "lng": 78.0969,
    "basin": "Bhind Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_bhopal",
    "name": "Bhopal",
    "state": "Madhya Pradesh",
    "lat": 22.4134,
    "lng": 78.0969,
    "basin": "Bhopal Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_burhanpur",
    "name": "Burhanpur",
    "state": "Madhya Pradesh",
    "lat": 22.6934,
    "lng": 78.0969,
    "basin": "Burhanpur Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_chhatarpur",
    "name": "Chhatarpur",
    "state": "Madhya Pradesh",
    "lat": 22.9734,
    "lng": 78.0969,
    "basin": "Chhatarpur Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_chhindwara",
    "name": "Chhindwara",
    "state": "Madhya Pradesh",
    "lat": 23.2534,
    "lng": 78.0969,
    "basin": "Chhindwara Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_damoh",
    "name": "Damoh",
    "state": "Madhya Pradesh",
    "lat": 23.5334,
    "lng": 78.0969,
    "basin": "Damoh Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_datia",
    "name": "Datia",
    "state": "Madhya Pradesh",
    "lat": 23.8134,
    "lng": 78.0969,
    "basin": "Datia Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_dewas",
    "name": "Dewas",
    "state": "Madhya Pradesh",
    "lat": 22.1334,
    "lng": 78.3769,
    "basin": "Dewas Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_dhar",
    "name": "Dhar",
    "state": "Madhya Pradesh",
    "lat": 22.4134,
    "lng": 78.3769,
    "basin": "Dhar Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_dindori",
    "name": "Dindori",
    "state": "Madhya Pradesh",
    "lat": 22.6934,
    "lng": 78.3769,
    "basin": "Dindori Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_guna",
    "name": "Guna",
    "state": "Madhya Pradesh",
    "lat": 22.9734,
    "lng": 78.3769,
    "basin": "Guna Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_gwalior",
    "name": "Gwalior",
    "state": "Madhya Pradesh",
    "lat": 23.2534,
    "lng": 78.3769,
    "basin": "Gwalior Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_harda",
    "name": "Harda",
    "state": "Madhya Pradesh",
    "lat": 23.5334,
    "lng": 78.3769,
    "basin": "Harda Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_hoshangabad",
    "name": "Hoshangabad",
    "state": "Madhya Pradesh",
    "lat": 23.8134,
    "lng": 78.3769,
    "basin": "Hoshangabad Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_indore",
    "name": "Indore",
    "state": "Madhya Pradesh",
    "lat": 22.1334,
    "lng": 78.6569,
    "basin": "Indore Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_jabalpur",
    "name": "Jabalpur",
    "state": "Madhya Pradesh",
    "lat": 22.4134,
    "lng": 78.6569,
    "basin": "Jabalpur Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_jhabua",
    "name": "Jhabua",
    "state": "Madhya Pradesh",
    "lat": 22.6934,
    "lng": 78.6569,
    "basin": "Jhabua Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_katni",
    "name": "Katni",
    "state": "Madhya Pradesh",
    "lat": 22.9734,
    "lng": 78.6569,
    "basin": "Katni Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_khandwa",
    "name": "Khandwa",
    "state": "Madhya Pradesh",
    "lat": 23.2534,
    "lng": 78.6569,
    "basin": "Khandwa Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_khargone",
    "name": "Khargone",
    "state": "Madhya Pradesh",
    "lat": 23.5334,
    "lng": 78.6569,
    "basin": "Khargone Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_mandla",
    "name": "Mandla",
    "state": "Madhya Pradesh",
    "lat": 23.8134,
    "lng": 78.6569,
    "basin": "Mandla Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_mandsaur",
    "name": "Mandsaur",
    "state": "Madhya Pradesh",
    "lat": 22.1334,
    "lng": 78.9369,
    "basin": "Mandsaur Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_morena",
    "name": "Morena",
    "state": "Madhya Pradesh",
    "lat": 22.4134,
    "lng": 78.9369,
    "basin": "Morena Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_narsinghpur",
    "name": "Narsinghpur",
    "state": "Madhya Pradesh",
    "lat": 22.6934,
    "lng": 78.9369,
    "basin": "Narsinghpur Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_neemuch",
    "name": "Neemuch",
    "state": "Madhya Pradesh",
    "lat": 22.9734,
    "lng": 78.9369,
    "basin": "Neemuch Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_niwari",
    "name": "Niwari",
    "state": "Madhya Pradesh",
    "lat": 23.2534,
    "lng": 78.9369,
    "basin": "Niwari Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_panna",
    "name": "Panna",
    "state": "Madhya Pradesh",
    "lat": 23.5334,
    "lng": 78.9369,
    "basin": "Panna Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_raisen",
    "name": "Raisen",
    "state": "Madhya Pradesh",
    "lat": 23.8134,
    "lng": 78.9369,
    "basin": "Raisen Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_rajgarh",
    "name": "Rajgarh",
    "state": "Madhya Pradesh",
    "lat": 22.1334,
    "lng": 79.2169,
    "basin": "Rajgarh Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_ratlam",
    "name": "Ratlam",
    "state": "Madhya Pradesh",
    "lat": 22.4134,
    "lng": 79.2169,
    "basin": "Ratlam Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_rewa",
    "name": "Rewa",
    "state": "Madhya Pradesh",
    "lat": 22.6934,
    "lng": 79.2169,
    "basin": "Rewa Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_sagar",
    "name": "Sagar",
    "state": "Madhya Pradesh",
    "lat": 22.9734,
    "lng": 79.2169,
    "basin": "Sagar Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_satna",
    "name": "Satna",
    "state": "Madhya Pradesh",
    "lat": 23.2534,
    "lng": 79.2169,
    "basin": "Satna Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_sehore",
    "name": "Sehore",
    "state": "Madhya Pradesh",
    "lat": 23.5334,
    "lng": 79.2169,
    "basin": "Sehore Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_seoni",
    "name": "Seoni",
    "state": "Madhya Pradesh",
    "lat": 23.8134,
    "lng": 79.2169,
    "basin": "Seoni Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_shahdol",
    "name": "Shahdol",
    "state": "Madhya Pradesh",
    "lat": 22.1334,
    "lng": 79.4969,
    "basin": "Shahdol Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_shajapur",
    "name": "Shajapur",
    "state": "Madhya Pradesh",
    "lat": 22.4134,
    "lng": 79.4969,
    "basin": "Shajapur Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_sheopur",
    "name": "Sheopur",
    "state": "Madhya Pradesh",
    "lat": 22.6934,
    "lng": 79.4969,
    "basin": "Sheopur Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_shivpuri",
    "name": "Shivpuri",
    "state": "Madhya Pradesh",
    "lat": 22.9734,
    "lng": 79.4969,
    "basin": "Shivpuri Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_sidhi",
    "name": "Sidhi",
    "state": "Madhya Pradesh",
    "lat": 23.2534,
    "lng": 79.4969,
    "basin": "Sidhi Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_singrauli",
    "name": "Singrauli",
    "state": "Madhya Pradesh",
    "lat": 23.5334,
    "lng": 79.4969,
    "basin": "Singrauli Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_tikamgarh",
    "name": "Tikamgarh",
    "state": "Madhya Pradesh",
    "lat": 23.8134,
    "lng": 79.4969,
    "basin": "Tikamgarh Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_ujjain",
    "name": "Ujjain",
    "state": "Madhya Pradesh",
    "lat": 22.1334,
    "lng": 77.8169,
    "basin": "Ujjain Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_umaria",
    "name": "Umaria",
    "state": "Madhya Pradesh",
    "lat": 22.4134,
    "lng": 77.8169,
    "basin": "Umaria Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_vidisha",
    "name": "Vidisha",
    "state": "Madhya Pradesh",
    "lat": 22.6934,
    "lng": 77.8169,
    "basin": "Vidisha Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_mauganj",
    "name": "Mauganj",
    "state": "Madhya Pradesh",
    "lat": 22.9734,
    "lng": 77.8169,
    "basin": "Mauganj Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_maihar",
    "name": "Maihar",
    "state": "Madhya Pradesh",
    "lat": 23.2534,
    "lng": 77.8169,
    "basin": "Maihar Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_pandhurna",
    "name": "Pandhurna",
    "state": "Madhya Pradesh",
    "lat": 23.5334,
    "lng": 77.8169,
    "basin": "Pandhurna Sub-basin & Narmada, Chambal & Betwa Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_ahmednagar",
    "name": "Ahmednagar",
    "state": "Maharashtra",
    "lat": 18.9115,
    "lng": 74.8739,
    "basin": "Ahmednagar Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_akola",
    "name": "Akola",
    "state": "Maharashtra",
    "lat": 19.1915,
    "lng": 74.8739,
    "basin": "Akola Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_amravati",
    "name": "Amravati",
    "state": "Maharashtra",
    "lat": 19.4715,
    "lng": 74.8739,
    "basin": "Amravati Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_chhatrapati_sambhajinagar",
    "name": "Chhatrapati Sambhajinagar",
    "state": "Maharashtra",
    "lat": 19.7515,
    "lng": 74.8739,
    "basin": "Chhatrapati Sambhajinagar Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_beed",
    "name": "Beed",
    "state": "Maharashtra",
    "lat": 20.0315,
    "lng": 74.8739,
    "basin": "Beed Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_bhandara",
    "name": "Bhandara",
    "state": "Maharashtra",
    "lat": 20.3115,
    "lng": 74.8739,
    "basin": "Bhandara Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_buldhana",
    "name": "Buldhana",
    "state": "Maharashtra",
    "lat": 20.5915,
    "lng": 74.8739,
    "basin": "Buldhana Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_chandrapur",
    "name": "Chandrapur",
    "state": "Maharashtra",
    "lat": 18.9115,
    "lng": 75.1539,
    "basin": "Chandrapur Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_dhule",
    "name": "Dhule",
    "state": "Maharashtra",
    "lat": 19.1915,
    "lng": 75.1539,
    "basin": "Dhule Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_gadchiroli",
    "name": "Gadchiroli",
    "state": "Maharashtra",
    "lat": 19.4715,
    "lng": 75.1539,
    "basin": "Gadchiroli Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_gondia",
    "name": "Gondia",
    "state": "Maharashtra",
    "lat": 19.7515,
    "lng": 75.1539,
    "basin": "Gondia Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_hingoli",
    "name": "Hingoli",
    "state": "Maharashtra",
    "lat": 20.0315,
    "lng": 75.1539,
    "basin": "Hingoli Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_jalgaon",
    "name": "Jalgaon",
    "state": "Maharashtra",
    "lat": 20.3115,
    "lng": 75.1539,
    "basin": "Jalgaon Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_jalna",
    "name": "Jalna",
    "state": "Maharashtra",
    "lat": 20.5915,
    "lng": 75.1539,
    "basin": "Jalna Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_kolhapur",
    "name": "Kolhapur",
    "state": "Maharashtra",
    "lat": 18.9115,
    "lng": 75.4339,
    "basin": "Kolhapur Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_latur",
    "name": "Latur",
    "state": "Maharashtra",
    "lat": 19.1915,
    "lng": 75.4339,
    "basin": "Latur Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_mumbai_city",
    "name": "Mumbai City",
    "state": "Maharashtra",
    "lat": 19.4715,
    "lng": 75.4339,
    "basin": "Mumbai City Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_mumbai_suburban",
    "name": "Mumbai Suburban",
    "state": "Maharashtra",
    "lat": 19.7515,
    "lng": 75.4339,
    "basin": "Mumbai Suburban Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_nagpur",
    "name": "Nagpur",
    "state": "Maharashtra",
    "lat": 20.0315,
    "lng": 75.4339,
    "basin": "Nagpur Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_nanded",
    "name": "Nanded",
    "state": "Maharashtra",
    "lat": 20.3115,
    "lng": 75.4339,
    "basin": "Nanded Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_nandurbar",
    "name": "Nandurbar",
    "state": "Maharashtra",
    "lat": 20.5915,
    "lng": 75.4339,
    "basin": "Nandurbar Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_nashik",
    "name": "Nashik",
    "state": "Maharashtra",
    "lat": 18.9115,
    "lng": 75.7139,
    "basin": "Nashik Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_dharashiv",
    "name": "Dharashiv",
    "state": "Maharashtra",
    "lat": 19.1915,
    "lng": 75.7139,
    "basin": "Dharashiv Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_palghar",
    "name": "Palghar",
    "state": "Maharashtra",
    "lat": 19.4715,
    "lng": 75.7139,
    "basin": "Palghar Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_parbhani",
    "name": "Parbhani",
    "state": "Maharashtra",
    "lat": 19.7515,
    "lng": 75.7139,
    "basin": "Parbhani Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_pune",
    "name": "Pune",
    "state": "Maharashtra",
    "lat": 20.0315,
    "lng": 75.7139,
    "basin": "Pune Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_raigad",
    "name": "Raigad",
    "state": "Maharashtra",
    "lat": 20.3115,
    "lng": 75.7139,
    "basin": "Raigad Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_ratnagiri",
    "name": "Ratnagiri",
    "state": "Maharashtra",
    "lat": 20.5915,
    "lng": 75.7139,
    "basin": "Ratnagiri Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_sangli",
    "name": "Sangli",
    "state": "Maharashtra",
    "lat": 18.9115,
    "lng": 75.9939,
    "basin": "Sangli Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_satara",
    "name": "Satara",
    "state": "Maharashtra",
    "lat": 19.1915,
    "lng": 75.9939,
    "basin": "Satara Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_sindhudurg",
    "name": "Sindhudurg",
    "state": "Maharashtra",
    "lat": 19.4715,
    "lng": 75.9939,
    "basin": "Sindhudurg Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_solapur",
    "name": "Solapur",
    "state": "Maharashtra",
    "lat": 19.7515,
    "lng": 75.9939,
    "basin": "Solapur Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ma_thane",
    "name": "Thane",
    "state": "Maharashtra",
    "lat": 20.0315,
    "lng": 75.9939,
    "basin": "Thane Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_wardha",
    "name": "Wardha",
    "state": "Maharashtra",
    "lat": 20.3115,
    "lng": 75.9939,
    "basin": "Wardha Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_washim",
    "name": "Washim",
    "state": "Maharashtra",
    "lat": 20.5915,
    "lng": 75.9939,
    "basin": "Washim Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_yavatmal",
    "name": "Yavatmal",
    "state": "Maharashtra",
    "lat": 18.9115,
    "lng": 76.2739,
    "basin": "Yavatmal Sub-basin & Godavari, Krishna & Tapi Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_bishnupur",
    "name": "Bishnupur",
    "state": "Manipur",
    "lat": 23.8237,
    "lng": 93.0663,
    "basin": "Bishnupur Sub-basin & Imphal & Barak River Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_chandel",
    "name": "Chandel",
    "state": "Manipur",
    "lat": 24.1037,
    "lng": 93.0663,
    "basin": "Chandel Sub-basin & Imphal & Barak River Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "ma_churachandpur",
    "name": "Churachandpur",
    "state": "Manipur",
    "lat": 24.3837,
    "lng": 93.0663,
    "basin": "Churachandpur Sub-basin & Imphal & Barak River Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_imphal_east",
    "name": "Imphal East",
    "state": "Manipur",
    "lat": 24.6637,
    "lng": 93.0663,
    "basin": "Imphal East Sub-basin & Imphal & Barak River Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "ma_imphal_west",
    "name": "Imphal West",
    "state": "Manipur",
    "lat": 24.9437,
    "lng": 93.0663,
    "basin": "Imphal West Sub-basin & Imphal & Barak River Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_jiribam",
    "name": "Jiribam",
    "state": "Manipur",
    "lat": 25.2237,
    "lng": 93.0663,
    "basin": "Jiribam Sub-basin & Imphal & Barak River Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_kakching",
    "name": "Kakching",
    "state": "Manipur",
    "lat": 25.5037,
    "lng": 93.0663,
    "basin": "Kakching Sub-basin & Imphal & Barak River Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "ma_kamjong",
    "name": "Kamjong",
    "state": "Manipur",
    "lat": 23.8237,
    "lng": 93.3463,
    "basin": "Kamjong Sub-basin & Imphal & Barak River Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "ma_kangpokpi",
    "name": "Kangpokpi",
    "state": "Manipur",
    "lat": 24.1037,
    "lng": 93.3463,
    "basin": "Kangpokpi Sub-basin & Imphal & Barak River Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "ma_noney",
    "name": "Noney",
    "state": "Manipur",
    "lat": 24.3837,
    "lng": 93.3463,
    "basin": "Noney Sub-basin & Imphal & Barak River Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "ma_pherzawl",
    "name": "Pherzawl",
    "state": "Manipur",
    "lat": 24.6637,
    "lng": 93.3463,
    "basin": "Pherzawl Sub-basin & Imphal & Barak River Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_senapati",
    "name": "Senapati",
    "state": "Manipur",
    "lat": 24.9437,
    "lng": 93.3463,
    "basin": "Senapati Sub-basin & Imphal & Barak River Catchment",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_tamenglong",
    "name": "Tamenglong",
    "state": "Manipur",
    "lat": 25.2237,
    "lng": 93.3463,
    "basin": "Tamenglong Sub-basin & Imphal & Barak River Catchment",
    "threat": "ELEVATED"
  },
  {
    "id": "ma_tengnoupal",
    "name": "Tengnoupal",
    "state": "Manipur",
    "lat": 25.5037,
    "lng": 93.3463,
    "basin": "Tengnoupal Sub-basin & Imphal & Barak River Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "ma_thoubal",
    "name": "Thoubal",
    "state": "Manipur",
    "lat": 23.8237,
    "lng": 93.6263,
    "basin": "Thoubal Sub-basin & Imphal & Barak River Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "ma_ukhrul",
    "name": "Ukhrul",
    "state": "Manipur",
    "lat": 24.1037,
    "lng": 93.6263,
    "basin": "Ukhrul Sub-basin & Imphal & Barak River Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "me_east_garo_hills",
    "name": "East Garo Hills",
    "state": "Meghalaya",
    "lat": 24.627,
    "lng": 90.5262,
    "basin": "East Garo Hills Sub-basin & Khasi Hills Extreme Precipitation Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "me_east_jaintia_hills",
    "name": "East Jaintia Hills",
    "state": "Meghalaya",
    "lat": 24.907,
    "lng": 90.5262,
    "basin": "East Jaintia Hills Sub-basin & Khasi Hills Extreme Precipitation Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "me_east_khasi_hills",
    "name": "East Khasi Hills",
    "state": "Meghalaya",
    "lat": 25.187,
    "lng": 90.5262,
    "basin": "East Khasi Hills Sub-basin & Khasi Hills Extreme Precipitation Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "me_eastern_west_khasi_hills",
    "name": "Eastern West Khasi Hills",
    "state": "Meghalaya",
    "lat": 25.467,
    "lng": 90.5262,
    "basin": "Eastern West Khasi Hills Sub-basin & Khasi Hills Extreme Precipitation Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "me_north_garo_hills",
    "name": "North Garo Hills",
    "state": "Meghalaya",
    "lat": 25.747,
    "lng": 90.5262,
    "basin": "North Garo Hills Sub-basin & Khasi Hills Extreme Precipitation Basin",
    "threat": "MONITOR"
  },
  {
    "id": "me_ri_bhoi",
    "name": "Ri Bhoi",
    "state": "Meghalaya",
    "lat": 26.027,
    "lng": 90.5262,
    "basin": "Ri Bhoi Sub-basin & Khasi Hills Extreme Precipitation Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "me_south_garo_hills",
    "name": "South Garo Hills",
    "state": "Meghalaya",
    "lat": 26.307,
    "lng": 90.5262,
    "basin": "South Garo Hills Sub-basin & Khasi Hills Extreme Precipitation Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "me_south_west_garo_hills",
    "name": "South West Garo Hills",
    "state": "Meghalaya",
    "lat": 24.627,
    "lng": 90.8062,
    "basin": "South West Garo Hills Sub-basin & Khasi Hills Extreme Precipitation Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "me_south_west_khasi_hills",
    "name": "South West Khasi Hills",
    "state": "Meghalaya",
    "lat": 24.907,
    "lng": 90.8062,
    "basin": "South West Khasi Hills Sub-basin & Khasi Hills Extreme Precipitation Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "me_west_garo_hills",
    "name": "West Garo Hills",
    "state": "Meghalaya",
    "lat": 25.187,
    "lng": 90.8062,
    "basin": "West Garo Hills Sub-basin & Khasi Hills Extreme Precipitation Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "me_west_jaintia_hills",
    "name": "West Jaintia Hills",
    "state": "Meghalaya",
    "lat": 25.467,
    "lng": 90.8062,
    "basin": "West Jaintia Hills Sub-basin & Khasi Hills Extreme Precipitation Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "me_west_khasi_hills",
    "name": "West Khasi Hills",
    "state": "Meghalaya",
    "lat": 25.747,
    "lng": 90.8062,
    "basin": "West Khasi Hills Sub-basin & Khasi Hills Extreme Precipitation Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "mi_aizawl",
    "name": "Aizawl",
    "state": "Mizoram",
    "lat": 22.3245,
    "lng": 92.0976,
    "basin": "Aizawl Sub-basin & Tlawng & Kolodyne River Valley",
    "threat": "CRITICAL"
  },
  {
    "id": "mi_champhai",
    "name": "Champhai",
    "state": "Mizoram",
    "lat": 22.6045,
    "lng": 92.0976,
    "basin": "Champhai Sub-basin & Tlawng & Kolodyne River Valley",
    "threat": "CRITICAL"
  },
  {
    "id": "mi_hnahthial",
    "name": "Hnahthial",
    "state": "Mizoram",
    "lat": 22.8845,
    "lng": 92.0976,
    "basin": "Hnahthial Sub-basin & Tlawng & Kolodyne River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "mi_khawzawl",
    "name": "Khawzawl",
    "state": "Mizoram",
    "lat": 23.1645,
    "lng": 92.0976,
    "basin": "Khawzawl Sub-basin & Tlawng & Kolodyne River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "mi_kolasib",
    "name": "Kolasib",
    "state": "Mizoram",
    "lat": 23.4445,
    "lng": 92.0976,
    "basin": "Kolasib Sub-basin & Tlawng & Kolodyne River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "mi_lawngtlai",
    "name": "Lawngtlai",
    "state": "Mizoram",
    "lat": 23.7245,
    "lng": 92.0976,
    "basin": "Lawngtlai Sub-basin & Tlawng & Kolodyne River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "mi_lunglei",
    "name": "Lunglei",
    "state": "Mizoram",
    "lat": 24.0045,
    "lng": 92.0976,
    "basin": "Lunglei Sub-basin & Tlawng & Kolodyne River Valley",
    "threat": "ELEVATED"
  },
  {
    "id": "mi_mamit",
    "name": "Mamit",
    "state": "Mizoram",
    "lat": 22.3245,
    "lng": 92.3776,
    "basin": "Mamit Sub-basin & Tlawng & Kolodyne River Valley",
    "threat": "CRITICAL"
  },
  {
    "id": "mi_saitual",
    "name": "Saitual",
    "state": "Mizoram",
    "lat": 22.6045,
    "lng": 92.3776,
    "basin": "Saitual Sub-basin & Tlawng & Kolodyne River Valley",
    "threat": "CRITICAL"
  },
  {
    "id": "mi_serchhip",
    "name": "Serchhip",
    "state": "Mizoram",
    "lat": 22.8845,
    "lng": 92.3776,
    "basin": "Serchhip Sub-basin & Tlawng & Kolodyne River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "mi_siaha",
    "name": "Siaha",
    "state": "Mizoram",
    "lat": 23.1645,
    "lng": 92.3776,
    "basin": "Siaha Sub-basin & Tlawng & Kolodyne River Valley",
    "threat": "CRITICAL"
  },
  {
    "id": "na_chumoukedima",
    "name": "Chumoukedima",
    "state": "Nagaland",
    "lat": 25.3184,
    "lng": 93.7224,
    "basin": "Chumoukedima Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "na_dimapur",
    "name": "Dimapur",
    "state": "Nagaland",
    "lat": 25.5984,
    "lng": 93.7224,
    "basin": "Dimapur Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "na_kiphire",
    "name": "Kiphire",
    "state": "Nagaland",
    "lat": 25.8784,
    "lng": 93.7224,
    "basin": "Kiphire Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "na_kohima",
    "name": "Kohima",
    "state": "Nagaland",
    "lat": 26.1584,
    "lng": 93.7224,
    "basin": "Kohima Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "na_longleng",
    "name": "Longleng",
    "state": "Nagaland",
    "lat": 26.4384,
    "lng": 93.7224,
    "basin": "Longleng Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "na_mokokchung",
    "name": "Mokokchung",
    "state": "Nagaland",
    "lat": 26.7184,
    "lng": 93.7224,
    "basin": "Mokokchung Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "na_mon",
    "name": "Mon",
    "state": "Nagaland",
    "lat": 26.9984,
    "lng": 93.7224,
    "basin": "Mon Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "na_niuland",
    "name": "Niuland",
    "state": "Nagaland",
    "lat": 25.3184,
    "lng": 94.0024,
    "basin": "Niuland Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "na_noklak",
    "name": "Noklak",
    "state": "Nagaland",
    "lat": 25.5984,
    "lng": 94.0024,
    "basin": "Noklak Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "na_peren",
    "name": "Peren",
    "state": "Nagaland",
    "lat": 25.8784,
    "lng": 94.0024,
    "basin": "Peren Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "na_phek",
    "name": "Phek",
    "state": "Nagaland",
    "lat": 26.1584,
    "lng": 94.0024,
    "basin": "Phek Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "na_shamator",
    "name": "Shamator",
    "state": "Nagaland",
    "lat": 26.4384,
    "lng": 94.0024,
    "basin": "Shamator Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "ELEVATED"
  },
  {
    "id": "na_tseminyu",
    "name": "Tseminyu",
    "state": "Nagaland",
    "lat": 26.7184,
    "lng": 94.0024,
    "basin": "Tseminyu Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "MONITOR"
  },
  {
    "id": "na_tuensang",
    "name": "Tuensang",
    "state": "Nagaland",
    "lat": 26.9984,
    "lng": 94.0024,
    "basin": "Tuensang Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "na_wokha",
    "name": "Wokha",
    "state": "Nagaland",
    "lat": 25.3184,
    "lng": 94.2824,
    "basin": "Wokha Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "ELEVATED"
  },
  {
    "id": "na_zunheboto",
    "name": "Zunheboto",
    "state": "Nagaland",
    "lat": 25.5984,
    "lng": 94.2824,
    "basin": "Zunheboto Sub-basin & Doyang & Dhansiri Catchment",
    "threat": "CRITICAL"
  },
  {
    "id": "od_angul",
    "name": "Angul",
    "state": "Odisha",
    "lat": 20.1117,
    "lng": 84.2585,
    "basin": "Angul Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "od_balangir",
    "name": "Balangir",
    "state": "Odisha",
    "lat": 20.3917,
    "lng": 84.2585,
    "basin": "Balangir Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "od_balasore",
    "name": "Balasore",
    "state": "Odisha",
    "lat": 20.6717,
    "lng": 84.2585,
    "basin": "Balasore Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "od_bargarh",
    "name": "Bargarh",
    "state": "Odisha",
    "lat": 20.9517,
    "lng": 84.2585,
    "basin": "Bargarh Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "od_bhadrak",
    "name": "Bhadrak",
    "state": "Odisha",
    "lat": 21.2317,
    "lng": 84.2585,
    "basin": "Bhadrak Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "od_boudh",
    "name": "Boudh",
    "state": "Odisha",
    "lat": 21.5117,
    "lng": 84.2585,
    "basin": "Boudh Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "od_cuttack",
    "name": "Cuttack",
    "state": "Odisha",
    "lat": 21.7917,
    "lng": 84.2585,
    "basin": "Cuttack Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "od_deogarh",
    "name": "Deogarh",
    "state": "Odisha",
    "lat": 20.1117,
    "lng": 84.5385,
    "basin": "Deogarh Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "od_dhenkanal",
    "name": "Dhenkanal",
    "state": "Odisha",
    "lat": 20.3917,
    "lng": 84.5385,
    "basin": "Dhenkanal Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "od_gajapati",
    "name": "Gajapati",
    "state": "Odisha",
    "lat": 20.6717,
    "lng": 84.5385,
    "basin": "Gajapati Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "od_ganjam",
    "name": "Ganjam",
    "state": "Odisha",
    "lat": 20.9517,
    "lng": 84.5385,
    "basin": "Ganjam Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "od_jagatsinghpur",
    "name": "Jagatsinghpur",
    "state": "Odisha",
    "lat": 21.2317,
    "lng": 84.5385,
    "basin": "Jagatsinghpur Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "od_jajpur",
    "name": "Jajpur",
    "state": "Odisha",
    "lat": 21.5117,
    "lng": 84.5385,
    "basin": "Jajpur Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "od_jharsuguda",
    "name": "Jharsuguda",
    "state": "Odisha",
    "lat": 21.7917,
    "lng": 84.5385,
    "basin": "Jharsuguda Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "od_kalahandi",
    "name": "Kalahandi",
    "state": "Odisha",
    "lat": 20.1117,
    "lng": 84.8185,
    "basin": "Kalahandi Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "od_kandhamal",
    "name": "Kandhamal",
    "state": "Odisha",
    "lat": 20.3917,
    "lng": 84.8185,
    "basin": "Kandhamal Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "od_kendrapara",
    "name": "Kendrapara",
    "state": "Odisha",
    "lat": 20.6717,
    "lng": 84.8185,
    "basin": "Kendrapara Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "od_kendujhar",
    "name": "Kendujhar",
    "state": "Odisha",
    "lat": 20.9517,
    "lng": 84.8185,
    "basin": "Kendujhar Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "od_khordha",
    "name": "Khordha",
    "state": "Odisha",
    "lat": 21.2317,
    "lng": 84.8185,
    "basin": "Khordha Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "od_koraput",
    "name": "Koraput",
    "state": "Odisha",
    "lat": 21.5117,
    "lng": 84.8185,
    "basin": "Koraput Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "od_malkangiri",
    "name": "Malkangiri",
    "state": "Odisha",
    "lat": 21.7917,
    "lng": 84.8185,
    "basin": "Malkangiri Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "od_mayurbhanj",
    "name": "Mayurbhanj",
    "state": "Odisha",
    "lat": 20.1117,
    "lng": 85.0985,
    "basin": "Mayurbhanj Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "od_nabarangpur",
    "name": "Nabarangpur",
    "state": "Odisha",
    "lat": 20.3917,
    "lng": 85.0985,
    "basin": "Nabarangpur Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "od_nayagarh",
    "name": "Nayagarh",
    "state": "Odisha",
    "lat": 20.6717,
    "lng": 85.0985,
    "basin": "Nayagarh Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "od_nuapada",
    "name": "Nuapada",
    "state": "Odisha",
    "lat": 20.9517,
    "lng": 85.0985,
    "basin": "Nuapada Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "od_puri",
    "name": "Puri",
    "state": "Odisha",
    "lat": 21.2317,
    "lng": 85.0985,
    "basin": "Puri Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "od_rayagada",
    "name": "Rayagada",
    "state": "Odisha",
    "lat": 21.5117,
    "lng": 85.0985,
    "basin": "Rayagada Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "od_sambalpur",
    "name": "Sambalpur",
    "state": "Odisha",
    "lat": 21.7917,
    "lng": 85.0985,
    "basin": "Sambalpur Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "od_subarnapur",
    "name": "Subarnapur",
    "state": "Odisha",
    "lat": 20.1117,
    "lng": 85.3785,
    "basin": "Subarnapur Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "od_sundargarh",
    "name": "Sundargarh",
    "state": "Odisha",
    "lat": 20.3917,
    "lng": 85.3785,
    "basin": "Sundargarh Sub-basin & Mahanadi & Brahmani Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "pu_amritsar",
    "name": "Amritsar",
    "state": "Punjab",
    "lat": 30.3071,
    "lng": 74.5012,
    "basin": "Amritsar Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "pu_barnala",
    "name": "Barnala",
    "state": "Punjab",
    "lat": 30.5871,
    "lng": 74.5012,
    "basin": "Barnala Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "pu_bathinda",
    "name": "Bathinda",
    "state": "Punjab",
    "lat": 30.8671,
    "lng": 74.5012,
    "basin": "Bathinda Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "pu_faridkot",
    "name": "Faridkot",
    "state": "Punjab",
    "lat": 31.1471,
    "lng": 74.5012,
    "basin": "Faridkot Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "pu_fatehgarh_sahib",
    "name": "Fatehgarh Sahib",
    "state": "Punjab",
    "lat": 31.4271,
    "lng": 74.5012,
    "basin": "Fatehgarh Sahib Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "pu_fazilka",
    "name": "Fazilka",
    "state": "Punjab",
    "lat": 31.7071,
    "lng": 74.5012,
    "basin": "Fazilka Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "pu_ferozepur",
    "name": "Ferozepur",
    "state": "Punjab",
    "lat": 31.9871,
    "lng": 74.5012,
    "basin": "Ferozepur Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "pu_gurdaspur",
    "name": "Gurdaspur",
    "state": "Punjab",
    "lat": 30.3071,
    "lng": 74.7812,
    "basin": "Gurdaspur Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "pu_hoshiarpur",
    "name": "Hoshiarpur",
    "state": "Punjab",
    "lat": 30.5871,
    "lng": 74.7812,
    "basin": "Hoshiarpur Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "pu_jalandhar",
    "name": "Jalandhar",
    "state": "Punjab",
    "lat": 30.8671,
    "lng": 74.7812,
    "basin": "Jalandhar Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "pu_kapurthala",
    "name": "Kapurthala",
    "state": "Punjab",
    "lat": 31.1471,
    "lng": 74.7812,
    "basin": "Kapurthala Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "pu_ludhiana",
    "name": "Ludhiana",
    "state": "Punjab",
    "lat": 31.4271,
    "lng": 74.7812,
    "basin": "Ludhiana Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "pu_malerkotla",
    "name": "Malerkotla",
    "state": "Punjab",
    "lat": 31.7071,
    "lng": 74.7812,
    "basin": "Malerkotla Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "pu_mansa",
    "name": "Mansa",
    "state": "Punjab",
    "lat": 31.9871,
    "lng": 74.7812,
    "basin": "Mansa Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "pu_moga",
    "name": "Moga",
    "state": "Punjab",
    "lat": 30.3071,
    "lng": 75.0612,
    "basin": "Moga Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "pu_muktsar",
    "name": "Muktsar",
    "state": "Punjab",
    "lat": 30.5871,
    "lng": 75.0612,
    "basin": "Muktsar Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "pu_pathankot",
    "name": "Pathankot",
    "state": "Punjab",
    "lat": 30.8671,
    "lng": 75.0612,
    "basin": "Pathankot Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "pu_patiala",
    "name": "Patiala",
    "state": "Punjab",
    "lat": 31.1471,
    "lng": 75.0612,
    "basin": "Patiala Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "pu_rupnagar",
    "name": "Rupnagar",
    "state": "Punjab",
    "lat": 31.4271,
    "lng": 75.0612,
    "basin": "Rupnagar Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "pu_sahibzada_ajit_singh_nagar",
    "name": "Sahibzada Ajit Singh Nagar",
    "state": "Punjab",
    "lat": 31.7071,
    "lng": 75.0612,
    "basin": "Sahibzada Ajit Singh Nagar Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "pu_sangrur",
    "name": "Sangrur",
    "state": "Punjab",
    "lat": 31.9871,
    "lng": 75.0612,
    "basin": "Sangrur Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "pu_shahid_bhagat_singh_nagar",
    "name": "Shahid Bhagat Singh Nagar",
    "state": "Punjab",
    "lat": 30.3071,
    "lng": 75.3412,
    "basin": "Shahid Bhagat Singh Nagar Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "pu_tarn_taran",
    "name": "Tarn Taran",
    "state": "Punjab",
    "lat": 30.5871,
    "lng": 75.3412,
    "basin": "Tarn Taran Sub-basin & Sutlej, Beas & Ravi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_ajmer",
    "name": "Ajmer",
    "state": "Rajasthan",
    "lat": 26.1838,
    "lng": 73.3779,
    "basin": "Ajmer Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_alwar",
    "name": "Alwar",
    "state": "Rajasthan",
    "lat": 26.4638,
    "lng": 73.3779,
    "basin": "Alwar Sub-basin & Luni & Chambal River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ra_anupgarh",
    "name": "Anupgarh",
    "state": "Rajasthan",
    "lat": 26.7438,
    "lng": 73.3779,
    "basin": "Anupgarh Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_balotra",
    "name": "Balotra",
    "state": "Rajasthan",
    "lat": 27.0238,
    "lng": 73.3779,
    "basin": "Balotra Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_banswara",
    "name": "Banswara",
    "state": "Rajasthan",
    "lat": 27.3038,
    "lng": 73.3779,
    "basin": "Banswara Sub-basin & Luni & Chambal River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ra_baran",
    "name": "Baran",
    "state": "Rajasthan",
    "lat": 27.5838,
    "lng": 73.3779,
    "basin": "Baran Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_barmer",
    "name": "Barmer",
    "state": "Rajasthan",
    "lat": 27.8638,
    "lng": 73.3779,
    "basin": "Barmer Sub-basin & Luni & Chambal River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ra_beawar",
    "name": "Beawar",
    "state": "Rajasthan",
    "lat": 26.1838,
    "lng": 73.6579,
    "basin": "Beawar Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_bharatpur",
    "name": "Bharatpur",
    "state": "Rajasthan",
    "lat": 26.4638,
    "lng": 73.6579,
    "basin": "Bharatpur Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_bhilwara",
    "name": "Bhilwara",
    "state": "Rajasthan",
    "lat": 26.7438,
    "lng": 73.6579,
    "basin": "Bhilwara Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_bikaner",
    "name": "Bikaner",
    "state": "Rajasthan",
    "lat": 27.0238,
    "lng": 73.6579,
    "basin": "Bikaner Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_bundi",
    "name": "Bundi",
    "state": "Rajasthan",
    "lat": 27.3038,
    "lng": 73.6579,
    "basin": "Bundi Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_chittorgarh",
    "name": "Chittorgarh",
    "state": "Rajasthan",
    "lat": 27.5838,
    "lng": 73.6579,
    "basin": "Chittorgarh Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_churu",
    "name": "Churu",
    "state": "Rajasthan",
    "lat": 27.8638,
    "lng": 73.6579,
    "basin": "Churu Sub-basin & Luni & Chambal River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ra_dausa",
    "name": "Dausa",
    "state": "Rajasthan",
    "lat": 26.1838,
    "lng": 73.9379,
    "basin": "Dausa Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_deeg",
    "name": "Deeg",
    "state": "Rajasthan",
    "lat": 26.4638,
    "lng": 73.9379,
    "basin": "Deeg Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_dholpur",
    "name": "Dholpur",
    "state": "Rajasthan",
    "lat": 26.7438,
    "lng": 73.9379,
    "basin": "Dholpur Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_didwana_kuchaman",
    "name": "Didwana-Kuchaman",
    "state": "Rajasthan",
    "lat": 27.0238,
    "lng": 73.9379,
    "basin": "Didwana-Kuchaman Sub-basin & Luni & Chambal River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ra_dudu",
    "name": "Dudu",
    "state": "Rajasthan",
    "lat": 27.3038,
    "lng": 73.9379,
    "basin": "Dudu Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_dungarpur",
    "name": "Dungarpur",
    "state": "Rajasthan",
    "lat": 27.5838,
    "lng": 73.9379,
    "basin": "Dungarpur Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_ganganagar",
    "name": "Ganganagar",
    "state": "Rajasthan",
    "lat": 27.8638,
    "lng": 73.9379,
    "basin": "Ganganagar Sub-basin & Luni & Chambal River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ra_gangapur_city",
    "name": "Gangapur City",
    "state": "Rajasthan",
    "lat": 26.1838,
    "lng": 74.2179,
    "basin": "Gangapur City Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_hanumangarh",
    "name": "Hanumangarh",
    "state": "Rajasthan",
    "lat": 26.4638,
    "lng": 74.2179,
    "basin": "Hanumangarh Sub-basin & Luni & Chambal River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ra_jaipur",
    "name": "Jaipur",
    "state": "Rajasthan",
    "lat": 26.7438,
    "lng": 74.2179,
    "basin": "Jaipur Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_jaipur_rural",
    "name": "Jaipur Rural",
    "state": "Rajasthan",
    "lat": 27.0238,
    "lng": 74.2179,
    "basin": "Jaipur Rural Sub-basin & Luni & Chambal River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ra_jaisalmer",
    "name": "Jaisalmer",
    "state": "Rajasthan",
    "lat": 27.3038,
    "lng": 74.2179,
    "basin": "Jaisalmer Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_jalore",
    "name": "Jalore",
    "state": "Rajasthan",
    "lat": 27.5838,
    "lng": 74.2179,
    "basin": "Jalore Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_jhalawar",
    "name": "Jhalawar",
    "state": "Rajasthan",
    "lat": 27.8638,
    "lng": 74.2179,
    "basin": "Jhalawar Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_jhunjhunu",
    "name": "Jhunjhunu",
    "state": "Rajasthan",
    "lat": 26.1838,
    "lng": 74.4979,
    "basin": "Jhunjhunu Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_jodhpur",
    "name": "Jodhpur",
    "state": "Rajasthan",
    "lat": 26.4638,
    "lng": 74.4979,
    "basin": "Jodhpur Sub-basin & Luni & Chambal River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ra_jodhpur_rural",
    "name": "Jodhpur Rural",
    "state": "Rajasthan",
    "lat": 26.7438,
    "lng": 74.4979,
    "basin": "Jodhpur Rural Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_karauli",
    "name": "Karauli",
    "state": "Rajasthan",
    "lat": 27.0238,
    "lng": 74.4979,
    "basin": "Karauli Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_kekri",
    "name": "Kekri",
    "state": "Rajasthan",
    "lat": 27.3038,
    "lng": 74.4979,
    "basin": "Kekri Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_khairthal_tijara",
    "name": "Khairthal-Tijara",
    "state": "Rajasthan",
    "lat": 27.5838,
    "lng": 74.4979,
    "basin": "Khairthal-Tijara Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_kota",
    "name": "Kota",
    "state": "Rajasthan",
    "lat": 27.8638,
    "lng": 74.4979,
    "basin": "Kota Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_kotputli_behror",
    "name": "Kotputli-Behror",
    "state": "Rajasthan",
    "lat": 26.1838,
    "lng": 74.7779,
    "basin": "Kotputli-Behror Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_nagaur",
    "name": "Nagaur",
    "state": "Rajasthan",
    "lat": 26.4638,
    "lng": 74.7779,
    "basin": "Nagaur Sub-basin & Luni & Chambal River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ra_neem_ka_thana",
    "name": "Neem Ka Thana",
    "state": "Rajasthan",
    "lat": 26.7438,
    "lng": 74.7779,
    "basin": "Neem Ka Thana Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_pali",
    "name": "Pali",
    "state": "Rajasthan",
    "lat": 27.0238,
    "lng": 74.7779,
    "basin": "Pali Sub-basin & Luni & Chambal River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ra_phalodi",
    "name": "Phalodi",
    "state": "Rajasthan",
    "lat": 27.3038,
    "lng": 74.7779,
    "basin": "Phalodi Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_pratapgarh",
    "name": "Pratapgarh",
    "state": "Rajasthan",
    "lat": 27.5838,
    "lng": 74.7779,
    "basin": "Pratapgarh Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_rajsamand",
    "name": "Rajsamand",
    "state": "Rajasthan",
    "lat": 27.8638,
    "lng": 74.7779,
    "basin": "Rajsamand Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_salumbar",
    "name": "Salumbar",
    "state": "Rajasthan",
    "lat": 26.1838,
    "lng": 75.0579,
    "basin": "Salumbar Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_sanchore",
    "name": "Sanchore",
    "state": "Rajasthan",
    "lat": 26.4638,
    "lng": 75.0579,
    "basin": "Sanchore Sub-basin & Luni & Chambal River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ra_sawai_madhopur",
    "name": "Sawai Madhopur",
    "state": "Rajasthan",
    "lat": 26.7438,
    "lng": 75.0579,
    "basin": "Sawai Madhopur Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_shahpura",
    "name": "Shahpura",
    "state": "Rajasthan",
    "lat": 27.0238,
    "lng": 75.0579,
    "basin": "Shahpura Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_sikar",
    "name": "Sikar",
    "state": "Rajasthan",
    "lat": 27.3038,
    "lng": 75.0579,
    "basin": "Sikar Sub-basin & Luni & Chambal River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ra_sirohi",
    "name": "Sirohi",
    "state": "Rajasthan",
    "lat": 27.5838,
    "lng": 75.0579,
    "basin": "Sirohi Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ra_tonk",
    "name": "Tonk",
    "state": "Rajasthan",
    "lat": 27.8638,
    "lng": 75.0579,
    "basin": "Tonk Sub-basin & Luni & Chambal River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ra_udaipur",
    "name": "Udaipur",
    "state": "Rajasthan",
    "lat": 26.1838,
    "lng": 73.3779,
    "basin": "Udaipur Sub-basin & Luni & Chambal River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "si_gangtok",
    "name": "Gangtok",
    "state": "Sikkim",
    "lat": 26.693,
    "lng": 87.6722,
    "basin": "Gangtok Sub-basin & Teesta & Rangeet Glacial GLOF Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "si_gyalshing",
    "name": "Gyalshing",
    "state": "Sikkim",
    "lat": 26.973,
    "lng": 87.6722,
    "basin": "Gyalshing Sub-basin & Teesta & Rangeet Glacial GLOF Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "si_mangan",
    "name": "Mangan",
    "state": "Sikkim",
    "lat": 27.253,
    "lng": 87.6722,
    "basin": "Mangan Sub-basin & Teesta & Rangeet Glacial GLOF Basin",
    "threat": "MONITOR"
  },
  {
    "id": "si_namchi",
    "name": "Namchi",
    "state": "Sikkim",
    "lat": 27.533,
    "lng": 87.6722,
    "basin": "Namchi Sub-basin & Teesta & Rangeet Glacial GLOF Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "si_pakyong",
    "name": "Pakyong",
    "state": "Sikkim",
    "lat": 27.813,
    "lng": 87.6722,
    "basin": "Pakyong Sub-basin & Teesta & Rangeet Glacial GLOF Basin",
    "threat": "MONITOR"
  },
  {
    "id": "si_soreng",
    "name": "Soreng",
    "state": "Sikkim",
    "lat": 28.093,
    "lng": 87.6722,
    "basin": "Soreng Sub-basin & Teesta & Rangeet Glacial GLOF Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ta_ariyalur",
    "name": "Ariyalur",
    "state": "Tamil Nadu",
    "lat": 10.2871,
    "lng": 77.8169,
    "basin": "Ariyalur Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ta_chengalpattu",
    "name": "Chengalpattu",
    "state": "Tamil Nadu",
    "lat": 10.5671,
    "lng": 77.8169,
    "basin": "Chengalpattu Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_chennai",
    "name": "Chennai",
    "state": "Tamil Nadu",
    "lat": 10.8471,
    "lng": 77.8169,
    "basin": "Chennai Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ta_coimbatore",
    "name": "Coimbatore",
    "state": "Tamil Nadu",
    "lat": 11.1271,
    "lng": 77.8169,
    "basin": "Coimbatore Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_cuddalore",
    "name": "Cuddalore",
    "state": "Tamil Nadu",
    "lat": 11.4071,
    "lng": 77.8169,
    "basin": "Cuddalore Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_dharmapuri",
    "name": "Dharmapuri",
    "state": "Tamil Nadu",
    "lat": 11.6871,
    "lng": 77.8169,
    "basin": "Dharmapuri Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ta_dindigul",
    "name": "Dindigul",
    "state": "Tamil Nadu",
    "lat": 11.9671,
    "lng": 77.8169,
    "basin": "Dindigul Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ta_erode",
    "name": "Erode",
    "state": "Tamil Nadu",
    "lat": 10.2871,
    "lng": 78.0969,
    "basin": "Erode Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ta_kallakurichi",
    "name": "Kallakurichi",
    "state": "Tamil Nadu",
    "lat": 10.5671,
    "lng": 78.0969,
    "basin": "Kallakurichi Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ta_kanchipuram",
    "name": "Kanchipuram",
    "state": "Tamil Nadu",
    "lat": 10.8471,
    "lng": 78.0969,
    "basin": "Kanchipuram Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ta_kanyakumari",
    "name": "Kanyakumari",
    "state": "Tamil Nadu",
    "lat": 11.1271,
    "lng": 78.0969,
    "basin": "Kanyakumari Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ta_karur",
    "name": "Karur",
    "state": "Tamil Nadu",
    "lat": 11.4071,
    "lng": 78.0969,
    "basin": "Karur Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_krishnagiri",
    "name": "Krishnagiri",
    "state": "Tamil Nadu",
    "lat": 11.6871,
    "lng": 78.0969,
    "basin": "Krishnagiri Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ta_madurai",
    "name": "Madurai",
    "state": "Tamil Nadu",
    "lat": 11.9671,
    "lng": 78.0969,
    "basin": "Madurai Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ta_mayiladuthurai",
    "name": "Mayiladuthurai",
    "state": "Tamil Nadu",
    "lat": 10.2871,
    "lng": 78.3769,
    "basin": "Mayiladuthurai Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_nagapattinam",
    "name": "Nagapattinam",
    "state": "Tamil Nadu",
    "lat": 10.5671,
    "lng": 78.3769,
    "basin": "Nagapattinam Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ta_namakkal",
    "name": "Namakkal",
    "state": "Tamil Nadu",
    "lat": 10.8471,
    "lng": 78.3769,
    "basin": "Namakkal Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ta_nilgiris",
    "name": "Nilgiris",
    "state": "Tamil Nadu",
    "lat": 11.1271,
    "lng": 78.3769,
    "basin": "Nilgiris Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_perambalur",
    "name": "Perambalur",
    "state": "Tamil Nadu",
    "lat": 11.4071,
    "lng": 78.3769,
    "basin": "Perambalur Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_pudukkottai",
    "name": "Pudukkottai",
    "state": "Tamil Nadu",
    "lat": 11.6871,
    "lng": 78.3769,
    "basin": "Pudukkottai Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ta_ramanathapuram",
    "name": "Ramanathapuram",
    "state": "Tamil Nadu",
    "lat": 11.9671,
    "lng": 78.3769,
    "basin": "Ramanathapuram Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_ranipet",
    "name": "Ranipet",
    "state": "Tamil Nadu",
    "lat": 10.2871,
    "lng": 78.6569,
    "basin": "Ranipet Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_salem",
    "name": "Salem",
    "state": "Tamil Nadu",
    "lat": 10.5671,
    "lng": 78.6569,
    "basin": "Salem Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ta_sivaganga",
    "name": "Sivaganga",
    "state": "Tamil Nadu",
    "lat": 10.8471,
    "lng": 78.6569,
    "basin": "Sivaganga Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ta_tenkasi",
    "name": "Tenkasi",
    "state": "Tamil Nadu",
    "lat": 11.1271,
    "lng": 78.6569,
    "basin": "Tenkasi Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_thanjavur",
    "name": "Thanjavur",
    "state": "Tamil Nadu",
    "lat": 11.4071,
    "lng": 78.6569,
    "basin": "Thanjavur Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_theni",
    "name": "Theni",
    "state": "Tamil Nadu",
    "lat": 11.6871,
    "lng": 78.6569,
    "basin": "Theni Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_thoothukudi",
    "name": "Thoothukudi",
    "state": "Tamil Nadu",
    "lat": 11.9671,
    "lng": 78.6569,
    "basin": "Thoothukudi Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ta_tiruchirappalli",
    "name": "Tiruchirappalli",
    "state": "Tamil Nadu",
    "lat": 10.2871,
    "lng": 78.9369,
    "basin": "Tiruchirappalli Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_tirunelveli",
    "name": "Tirunelveli",
    "state": "Tamil Nadu",
    "lat": 10.5671,
    "lng": 78.9369,
    "basin": "Tirunelveli Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_tirupathur",
    "name": "Tirupathur",
    "state": "Tamil Nadu",
    "lat": 10.8471,
    "lng": 78.9369,
    "basin": "Tirupathur Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_tiruppur",
    "name": "Tiruppur",
    "state": "Tamil Nadu",
    "lat": 11.1271,
    "lng": 78.9369,
    "basin": "Tiruppur Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ta_tiruvallur",
    "name": "Tiruvallur",
    "state": "Tamil Nadu",
    "lat": 11.4071,
    "lng": 78.9369,
    "basin": "Tiruvallur Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ta_tiruvannamalai",
    "name": "Tiruvannamalai",
    "state": "Tamil Nadu",
    "lat": 11.6871,
    "lng": 78.9369,
    "basin": "Tiruvannamalai Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ta_tiruvarur",
    "name": "Tiruvarur",
    "state": "Tamil Nadu",
    "lat": 11.9671,
    "lng": 78.9369,
    "basin": "Tiruvarur Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_vellore",
    "name": "Vellore",
    "state": "Tamil Nadu",
    "lat": 10.2871,
    "lng": 79.2169,
    "basin": "Vellore Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ta_viluppuram",
    "name": "Viluppuram",
    "state": "Tamil Nadu",
    "lat": 10.5671,
    "lng": 79.2169,
    "basin": "Viluppuram Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ta_virudhunagar",
    "name": "Virudhunagar",
    "state": "Tamil Nadu",
    "lat": 10.8471,
    "lng": 79.2169,
    "basin": "Virudhunagar Sub-basin & Cauvery, Vaigai & Palar Delta Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "te_adilabad",
    "name": "Adilabad",
    "state": "Telangana",
    "lat": 17.2724,
    "lng": 78.1793,
    "basin": "Adilabad Sub-basin & Godavari & Musi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "te_bhadradri_kothagudem",
    "name": "Bhadradri Kothagudem",
    "state": "Telangana",
    "lat": 17.5524,
    "lng": 78.1793,
    "basin": "Bhadradri Kothagudem Sub-basin & Godavari & Musi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "te_hanumakonda",
    "name": "Hanumakonda",
    "state": "Telangana",
    "lat": 17.8324,
    "lng": 78.1793,
    "basin": "Hanumakonda Sub-basin & Godavari & Musi River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "te_hyderabad",
    "name": "Hyderabad",
    "state": "Telangana",
    "lat": 18.1124,
    "lng": 78.1793,
    "basin": "Hyderabad Sub-basin & Godavari & Musi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "te_jagtial",
    "name": "Jagtial",
    "state": "Telangana",
    "lat": 18.3924,
    "lng": 78.1793,
    "basin": "Jagtial Sub-basin & Godavari & Musi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "te_jangaon",
    "name": "Jangaon",
    "state": "Telangana",
    "lat": 18.6724,
    "lng": 78.1793,
    "basin": "Jangaon Sub-basin & Godavari & Musi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "te_jayashankar_bhupalpally",
    "name": "Jayashankar Bhupalpally",
    "state": "Telangana",
    "lat": 18.9524,
    "lng": 78.1793,
    "basin": "Jayashankar Bhupalpally Sub-basin & Godavari & Musi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "te_jogulamba_gadwal",
    "name": "Jogulamba Gadwal",
    "state": "Telangana",
    "lat": 17.2724,
    "lng": 78.4593,
    "basin": "Jogulamba Gadwal Sub-basin & Godavari & Musi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "te_kamareddy",
    "name": "Kamareddy",
    "state": "Telangana",
    "lat": 17.5524,
    "lng": 78.4593,
    "basin": "Kamareddy Sub-basin & Godavari & Musi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "te_karimnagar",
    "name": "Karimnagar",
    "state": "Telangana",
    "lat": 17.8324,
    "lng": 78.4593,
    "basin": "Karimnagar Sub-basin & Godavari & Musi River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "te_khammam",
    "name": "Khammam",
    "state": "Telangana",
    "lat": 18.1124,
    "lng": 78.4593,
    "basin": "Khammam Sub-basin & Godavari & Musi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "te_kumuram_bheem_asifabad",
    "name": "Kumuram Bheem Asifabad",
    "state": "Telangana",
    "lat": 18.3924,
    "lng": 78.4593,
    "basin": "Kumuram Bheem Asifabad Sub-basin & Godavari & Musi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "te_mahabubabad",
    "name": "Mahabubabad",
    "state": "Telangana",
    "lat": 18.6724,
    "lng": 78.4593,
    "basin": "Mahabubabad Sub-basin & Godavari & Musi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "te_mahabubnagar",
    "name": "Mahabubnagar",
    "state": "Telangana",
    "lat": 18.9524,
    "lng": 78.4593,
    "basin": "Mahabubnagar Sub-basin & Godavari & Musi River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "te_mancherial",
    "name": "Mancherial",
    "state": "Telangana",
    "lat": 17.2724,
    "lng": 78.7393,
    "basin": "Mancherial Sub-basin & Godavari & Musi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "te_medak",
    "name": "Medak",
    "state": "Telangana",
    "lat": 17.5524,
    "lng": 78.7393,
    "basin": "Medak Sub-basin & Godavari & Musi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "te_medchal_malkajgiri",
    "name": "Medchal-Malkajgiri",
    "state": "Telangana",
    "lat": 17.8324,
    "lng": 78.7393,
    "basin": "Medchal-Malkajgiri Sub-basin & Godavari & Musi River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "te_mulugu",
    "name": "Mulugu",
    "state": "Telangana",
    "lat": 18.1124,
    "lng": 78.7393,
    "basin": "Mulugu Sub-basin & Godavari & Musi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "te_nagarkurnool",
    "name": "Nagarkurnool",
    "state": "Telangana",
    "lat": 18.3924,
    "lng": 78.7393,
    "basin": "Nagarkurnool Sub-basin & Godavari & Musi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "te_nalgonda",
    "name": "Nalgonda",
    "state": "Telangana",
    "lat": 18.6724,
    "lng": 78.7393,
    "basin": "Nalgonda Sub-basin & Godavari & Musi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "te_narayanpet",
    "name": "Narayanpet",
    "state": "Telangana",
    "lat": 18.9524,
    "lng": 78.7393,
    "basin": "Narayanpet Sub-basin & Godavari & Musi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "te_nirmal",
    "name": "Nirmal",
    "state": "Telangana",
    "lat": 17.2724,
    "lng": 79.0193,
    "basin": "Nirmal Sub-basin & Godavari & Musi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "te_nizamabad",
    "name": "Nizamabad",
    "state": "Telangana",
    "lat": 17.5524,
    "lng": 79.0193,
    "basin": "Nizamabad Sub-basin & Godavari & Musi River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "te_peddapalli",
    "name": "Peddapalli",
    "state": "Telangana",
    "lat": 17.8324,
    "lng": 79.0193,
    "basin": "Peddapalli Sub-basin & Godavari & Musi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "te_rajanna_sircilla",
    "name": "Rajanna Sircilla",
    "state": "Telangana",
    "lat": 18.1124,
    "lng": 79.0193,
    "basin": "Rajanna Sircilla Sub-basin & Godavari & Musi River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "te_rangareddy",
    "name": "Rangareddy",
    "state": "Telangana",
    "lat": 18.3924,
    "lng": 79.0193,
    "basin": "Rangareddy Sub-basin & Godavari & Musi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "te_sangareddy",
    "name": "Sangareddy",
    "state": "Telangana",
    "lat": 18.6724,
    "lng": 79.0193,
    "basin": "Sangareddy Sub-basin & Godavari & Musi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "te_siddipet",
    "name": "Siddipet",
    "state": "Telangana",
    "lat": 18.9524,
    "lng": 79.0193,
    "basin": "Siddipet Sub-basin & Godavari & Musi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "te_suryapet",
    "name": "Suryapet",
    "state": "Telangana",
    "lat": 17.2724,
    "lng": 79.2993,
    "basin": "Suryapet Sub-basin & Godavari & Musi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "te_vikarabad",
    "name": "Vikarabad",
    "state": "Telangana",
    "lat": 17.5524,
    "lng": 79.2993,
    "basin": "Vikarabad Sub-basin & Godavari & Musi River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "te_wanaparthy",
    "name": "Wanaparthy",
    "state": "Telangana",
    "lat": 17.8324,
    "lng": 79.2993,
    "basin": "Wanaparthy Sub-basin & Godavari & Musi River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "te_warangal",
    "name": "Warangal",
    "state": "Telangana",
    "lat": 18.1124,
    "lng": 79.2993,
    "basin": "Warangal Sub-basin & Godavari & Musi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "te_yadadri_bhuvanagiri",
    "name": "Yadadri Bhuvanagiri",
    "state": "Telangana",
    "lat": 18.3924,
    "lng": 79.2993,
    "basin": "Yadadri Bhuvanagiri Sub-basin & Godavari & Musi River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "tr_dhalai",
    "name": "Dhalai",
    "state": "Tripura",
    "lat": 23.1008,
    "lng": 91.1482,
    "basin": "Dhalai Sub-basin & Howrah & Gomati River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "tr_gomati",
    "name": "Gomati",
    "state": "Tripura",
    "lat": 23.3808,
    "lng": 91.1482,
    "basin": "Gomati Sub-basin & Howrah & Gomati River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "tr_khowai",
    "name": "Khowai",
    "state": "Tripura",
    "lat": 23.6608,
    "lng": 91.1482,
    "basin": "Khowai Sub-basin & Howrah & Gomati River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "tr_north_tripura",
    "name": "North Tripura",
    "state": "Tripura",
    "lat": 23.9408,
    "lng": 91.1482,
    "basin": "North Tripura Sub-basin & Howrah & Gomati River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "tr_sepahijala",
    "name": "Sepahijala",
    "state": "Tripura",
    "lat": 24.2208,
    "lng": 91.1482,
    "basin": "Sepahijala Sub-basin & Howrah & Gomati River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "tr_south_tripura",
    "name": "South Tripura",
    "state": "Tripura",
    "lat": 24.5008,
    "lng": 91.1482,
    "basin": "South Tripura Sub-basin & Howrah & Gomati River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "tr_unakoti",
    "name": "Unakoti",
    "state": "Tripura",
    "lat": 24.7808,
    "lng": 91.1482,
    "basin": "Unakoti Sub-basin & Howrah & Gomati River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "tr_west_tripura",
    "name": "West Tripura",
    "state": "Tripura",
    "lat": 23.1008,
    "lng": 91.4282,
    "basin": "West Tripura Sub-basin & Howrah & Gomati River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_agra",
    "name": "Agra",
    "state": "Uttar Pradesh",
    "lat": 26.0067,
    "lng": 80.1062,
    "basin": "Agra Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_aligarh",
    "name": "Aligarh",
    "state": "Uttar Pradesh",
    "lat": 26.2867,
    "lng": 80.1062,
    "basin": "Aligarh Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_ambedkar_nagar",
    "name": "Ambedkar Nagar",
    "state": "Uttar Pradesh",
    "lat": 26.5667,
    "lng": 80.1062,
    "basin": "Ambedkar Nagar Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_amethi",
    "name": "Amethi",
    "state": "Uttar Pradesh",
    "lat": 26.8467,
    "lng": 80.1062,
    "basin": "Amethi Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_amroha",
    "name": "Amroha",
    "state": "Uttar Pradesh",
    "lat": 27.1267,
    "lng": 80.1062,
    "basin": "Amroha Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_auraiya",
    "name": "Auraiya",
    "state": "Uttar Pradesh",
    "lat": 27.4067,
    "lng": 80.1062,
    "basin": "Auraiya Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_ayodhya",
    "name": "Ayodhya",
    "state": "Uttar Pradesh",
    "lat": 27.6867,
    "lng": 80.1062,
    "basin": "Ayodhya Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_azamgarh",
    "name": "Azamgarh",
    "state": "Uttar Pradesh",
    "lat": 26.0067,
    "lng": 80.3862,
    "basin": "Azamgarh Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_baghpat",
    "name": "Baghpat",
    "state": "Uttar Pradesh",
    "lat": 26.2867,
    "lng": 80.3862,
    "basin": "Baghpat Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_bahraich",
    "name": "Bahraich",
    "state": "Uttar Pradesh",
    "lat": 26.5667,
    "lng": 80.3862,
    "basin": "Bahraich Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_ballia",
    "name": "Ballia",
    "state": "Uttar Pradesh",
    "lat": 26.8467,
    "lng": 80.3862,
    "basin": "Ballia Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_balrampur",
    "name": "Balrampur",
    "state": "Uttar Pradesh",
    "lat": 27.1267,
    "lng": 80.3862,
    "basin": "Balrampur Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_banda",
    "name": "Banda",
    "state": "Uttar Pradesh",
    "lat": 27.4067,
    "lng": 80.3862,
    "basin": "Banda Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_barabanki",
    "name": "Barabanki",
    "state": "Uttar Pradesh",
    "lat": 27.6867,
    "lng": 80.3862,
    "basin": "Barabanki Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_bareilly",
    "name": "Bareilly",
    "state": "Uttar Pradesh",
    "lat": 26.0067,
    "lng": 80.6662,
    "basin": "Bareilly Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_basti",
    "name": "Basti",
    "state": "Uttar Pradesh",
    "lat": 26.2867,
    "lng": 80.6662,
    "basin": "Basti Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_bhadohi",
    "name": "Bhadohi",
    "state": "Uttar Pradesh",
    "lat": 26.5667,
    "lng": 80.6662,
    "basin": "Bhadohi Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_bijnor",
    "name": "Bijnor",
    "state": "Uttar Pradesh",
    "lat": 26.8467,
    "lng": 80.6662,
    "basin": "Bijnor Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_budaun",
    "name": "Budaun",
    "state": "Uttar Pradesh",
    "lat": 27.1267,
    "lng": 80.6662,
    "basin": "Budaun Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_bulandshahr",
    "name": "Bulandshahr",
    "state": "Uttar Pradesh",
    "lat": 27.4067,
    "lng": 80.6662,
    "basin": "Bulandshahr Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_chandauli",
    "name": "Chandauli",
    "state": "Uttar Pradesh",
    "lat": 27.6867,
    "lng": 80.6662,
    "basin": "Chandauli Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_chitrakoot",
    "name": "Chitrakoot",
    "state": "Uttar Pradesh",
    "lat": 26.0067,
    "lng": 80.9462,
    "basin": "Chitrakoot Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_deoria",
    "name": "Deoria",
    "state": "Uttar Pradesh",
    "lat": 26.2867,
    "lng": 80.9462,
    "basin": "Deoria Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_etah",
    "name": "Etah",
    "state": "Uttar Pradesh",
    "lat": 26.5667,
    "lng": 80.9462,
    "basin": "Etah Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_etawah",
    "name": "Etawah",
    "state": "Uttar Pradesh",
    "lat": 26.8467,
    "lng": 80.9462,
    "basin": "Etawah Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_farrukhabad",
    "name": "Farrukhabad",
    "state": "Uttar Pradesh",
    "lat": 27.1267,
    "lng": 80.9462,
    "basin": "Farrukhabad Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_fatehpur",
    "name": "Fatehpur",
    "state": "Uttar Pradesh",
    "lat": 27.4067,
    "lng": 80.9462,
    "basin": "Fatehpur Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_firozabad",
    "name": "Firozabad",
    "state": "Uttar Pradesh",
    "lat": 27.6867,
    "lng": 80.9462,
    "basin": "Firozabad Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_gautam_buddha_nagar",
    "name": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "lat": 26.0067,
    "lng": 81.2262,
    "basin": "Gautam Buddha Nagar Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_ghaziabad",
    "name": "Ghaziabad",
    "state": "Uttar Pradesh",
    "lat": 26.2867,
    "lng": 81.2262,
    "basin": "Ghaziabad Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_ghazipur",
    "name": "Ghazipur",
    "state": "Uttar Pradesh",
    "lat": 26.5667,
    "lng": 81.2262,
    "basin": "Ghazipur Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_gonda",
    "name": "Gonda",
    "state": "Uttar Pradesh",
    "lat": 26.8467,
    "lng": 81.2262,
    "basin": "Gonda Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_gorakhpur",
    "name": "Gorakhpur",
    "state": "Uttar Pradesh",
    "lat": 27.1267,
    "lng": 81.2262,
    "basin": "Gorakhpur Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_hamirpur",
    "name": "Hamirpur",
    "state": "Uttar Pradesh",
    "lat": 27.4067,
    "lng": 81.2262,
    "basin": "Hamirpur Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_hapur",
    "name": "Hapur",
    "state": "Uttar Pradesh",
    "lat": 27.6867,
    "lng": 81.2262,
    "basin": "Hapur Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_hardoi",
    "name": "Hardoi",
    "state": "Uttar Pradesh",
    "lat": 26.0067,
    "lng": 81.5062,
    "basin": "Hardoi Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_hathras",
    "name": "Hathras",
    "state": "Uttar Pradesh",
    "lat": 26.2867,
    "lng": 81.5062,
    "basin": "Hathras Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_jalaun",
    "name": "Jalaun",
    "state": "Uttar Pradesh",
    "lat": 26.5667,
    "lng": 81.5062,
    "basin": "Jalaun Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_jaunpur",
    "name": "Jaunpur",
    "state": "Uttar Pradesh",
    "lat": 26.8467,
    "lng": 81.5062,
    "basin": "Jaunpur Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_jhansi",
    "name": "Jhansi",
    "state": "Uttar Pradesh",
    "lat": 27.1267,
    "lng": 81.5062,
    "basin": "Jhansi Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_kannauj",
    "name": "Kannauj",
    "state": "Uttar Pradesh",
    "lat": 27.4067,
    "lng": 81.5062,
    "basin": "Kannauj Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_kanpur_dehat",
    "name": "Kanpur Dehat",
    "state": "Uttar Pradesh",
    "lat": 27.6867,
    "lng": 81.5062,
    "basin": "Kanpur Dehat Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_kanpur_nagar",
    "name": "Kanpur Nagar",
    "state": "Uttar Pradesh",
    "lat": 26.0067,
    "lng": 81.7862,
    "basin": "Kanpur Nagar Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_kasganj",
    "name": "Kasganj",
    "state": "Uttar Pradesh",
    "lat": 26.2867,
    "lng": 81.7862,
    "basin": "Kasganj Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_kaushambi",
    "name": "Kaushambi",
    "state": "Uttar Pradesh",
    "lat": 26.5667,
    "lng": 81.7862,
    "basin": "Kaushambi Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_kheri",
    "name": "Kheri",
    "state": "Uttar Pradesh",
    "lat": 26.8467,
    "lng": 81.7862,
    "basin": "Kheri Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_kushinagar",
    "name": "Kushinagar",
    "state": "Uttar Pradesh",
    "lat": 27.1267,
    "lng": 81.7862,
    "basin": "Kushinagar Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_lalitpur",
    "name": "Lalitpur",
    "state": "Uttar Pradesh",
    "lat": 27.4067,
    "lng": 81.7862,
    "basin": "Lalitpur Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_lucknow",
    "name": "Lucknow",
    "state": "Uttar Pradesh",
    "lat": 27.6867,
    "lng": 81.7862,
    "basin": "Lucknow Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_maharajganj",
    "name": "Maharajganj",
    "state": "Uttar Pradesh",
    "lat": 26.0067,
    "lng": 80.1062,
    "basin": "Maharajganj Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_mahoba",
    "name": "Mahoba",
    "state": "Uttar Pradesh",
    "lat": 26.2867,
    "lng": 80.1062,
    "basin": "Mahoba Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_mainpuri",
    "name": "Mainpuri",
    "state": "Uttar Pradesh",
    "lat": 26.5667,
    "lng": 80.1062,
    "basin": "Mainpuri Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_mathura",
    "name": "Mathura",
    "state": "Uttar Pradesh",
    "lat": 26.8467,
    "lng": 80.1062,
    "basin": "Mathura Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_mau",
    "name": "Mau",
    "state": "Uttar Pradesh",
    "lat": 27.1267,
    "lng": 80.1062,
    "basin": "Mau Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_meerut",
    "name": "Meerut",
    "state": "Uttar Pradesh",
    "lat": 27.4067,
    "lng": 80.1062,
    "basin": "Meerut Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_mirzapur",
    "name": "Mirzapur",
    "state": "Uttar Pradesh",
    "lat": 27.6867,
    "lng": 80.1062,
    "basin": "Mirzapur Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_moradabad",
    "name": "Moradabad",
    "state": "Uttar Pradesh",
    "lat": 26.0067,
    "lng": 80.3862,
    "basin": "Moradabad Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_muzaffarnagar",
    "name": "Muzaffarnagar",
    "state": "Uttar Pradesh",
    "lat": 26.2867,
    "lng": 80.3862,
    "basin": "Muzaffarnagar Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_pilibhit",
    "name": "Pilibhit",
    "state": "Uttar Pradesh",
    "lat": 26.5667,
    "lng": 80.3862,
    "basin": "Pilibhit Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_pratapgarh",
    "name": "Pratapgarh",
    "state": "Uttar Pradesh",
    "lat": 26.8467,
    "lng": 80.3862,
    "basin": "Pratapgarh Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_prayagraj",
    "name": "Prayagraj",
    "state": "Uttar Pradesh",
    "lat": 27.1267,
    "lng": 80.3862,
    "basin": "Prayagraj Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_raebareli",
    "name": "Raebareli",
    "state": "Uttar Pradesh",
    "lat": 27.4067,
    "lng": 80.3862,
    "basin": "Raebareli Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_rampur",
    "name": "Rampur",
    "state": "Uttar Pradesh",
    "lat": 27.6867,
    "lng": 80.3862,
    "basin": "Rampur Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_saharanpur",
    "name": "Saharanpur",
    "state": "Uttar Pradesh",
    "lat": 26.0067,
    "lng": 80.6662,
    "basin": "Saharanpur Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_sambhal",
    "name": "Sambhal",
    "state": "Uttar Pradesh",
    "lat": 26.2867,
    "lng": 80.6662,
    "basin": "Sambhal Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_sant_kabir_nagar",
    "name": "Sant Kabir Nagar",
    "state": "Uttar Pradesh",
    "lat": 26.5667,
    "lng": 80.6662,
    "basin": "Sant Kabir Nagar Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_shahjahanpur",
    "name": "Shahjahanpur",
    "state": "Uttar Pradesh",
    "lat": 26.8467,
    "lng": 80.6662,
    "basin": "Shahjahanpur Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_shamli",
    "name": "Shamli",
    "state": "Uttar Pradesh",
    "lat": 27.1267,
    "lng": 80.6662,
    "basin": "Shamli Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_shravasti",
    "name": "Shravasti",
    "state": "Uttar Pradesh",
    "lat": 27.4067,
    "lng": 80.6662,
    "basin": "Shravasti Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_siddharthnagar",
    "name": "Siddharthnagar",
    "state": "Uttar Pradesh",
    "lat": 27.6867,
    "lng": 80.6662,
    "basin": "Siddharthnagar Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_sitapur",
    "name": "Sitapur",
    "state": "Uttar Pradesh",
    "lat": 26.0067,
    "lng": 80.9462,
    "basin": "Sitapur Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_sonbhadra",
    "name": "Sonbhadra",
    "state": "Uttar Pradesh",
    "lat": 26.2867,
    "lng": 80.9462,
    "basin": "Sonbhadra Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "MONITOR"
  },
  {
    "id": "ut_sultanpur",
    "name": "Sultanpur",
    "state": "Uttar Pradesh",
    "lat": 26.5667,
    "lng": 80.9462,
    "basin": "Sultanpur Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_unnao",
    "name": "Unnao",
    "state": "Uttar Pradesh",
    "lat": 26.8467,
    "lng": 80.9462,
    "basin": "Unnao Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_varanasi",
    "name": "Varanasi",
    "state": "Uttar Pradesh",
    "lat": 27.1267,
    "lng": 80.9462,
    "basin": "Varanasi Sub-basin & Ganga, Yamuna & Gomti River Basin",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_almora",
    "name": "Almora",
    "state": "Uttarakhand",
    "lat": 29.2268,
    "lng": 78.1793,
    "basin": "Almora Sub-basin & Alaknanda, Bhagirathi & Ganga Outflow",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_bageshwar",
    "name": "Bageshwar",
    "state": "Uttarakhand",
    "lat": 29.5068,
    "lng": 78.1793,
    "basin": "Bageshwar Sub-basin & Alaknanda, Bhagirathi & Ganga Outflow",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_chamoli",
    "name": "Chamoli",
    "state": "Uttarakhand",
    "lat": 29.7868,
    "lng": 78.1793,
    "basin": "Chamoli Sub-basin & Alaknanda, Bhagirathi & Ganga Outflow",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_champawat",
    "name": "Champawat",
    "state": "Uttarakhand",
    "lat": 30.0668,
    "lng": 78.1793,
    "basin": "Champawat Sub-basin & Alaknanda, Bhagirathi & Ganga Outflow",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_dehradun",
    "name": "Dehradun",
    "state": "Uttarakhand",
    "lat": 30.3468,
    "lng": 78.1793,
    "basin": "Dehradun Sub-basin & Alaknanda, Bhagirathi & Ganga Outflow",
    "threat": "CRITICAL"
  },
  {
    "id": "ut_haridwar",
    "name": "Haridwar",
    "state": "Uttarakhand",
    "lat": 30.6268,
    "lng": 78.1793,
    "basin": "Haridwar Sub-basin & Alaknanda, Bhagirathi & Ganga Outflow",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_nainital",
    "name": "Nainital",
    "state": "Uttarakhand",
    "lat": 30.9068,
    "lng": 78.1793,
    "basin": "Nainital Sub-basin & Alaknanda, Bhagirathi & Ganga Outflow",
    "threat": "MONITOR"
  },
  {
    "id": "ut_pauri_garhwal",
    "name": "Pauri Garhwal",
    "state": "Uttarakhand",
    "lat": 29.2268,
    "lng": 78.4593,
    "basin": "Pauri Garhwal Sub-basin & Alaknanda, Bhagirathi & Ganga Outflow",
    "threat": "MONITOR"
  },
  {
    "id": "ut_pithoragarh",
    "name": "Pithoragarh",
    "state": "Uttarakhand",
    "lat": 29.5068,
    "lng": 78.4593,
    "basin": "Pithoragarh Sub-basin & Alaknanda, Bhagirathi & Ganga Outflow",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_rudraprayag",
    "name": "Rudraprayag",
    "state": "Uttarakhand",
    "lat": 29.7868,
    "lng": 78.4593,
    "basin": "Rudraprayag Sub-basin & Alaknanda, Bhagirathi & Ganga Outflow",
    "threat": "MONITOR"
  },
  {
    "id": "ut_tehri_garhwal",
    "name": "Tehri Garhwal",
    "state": "Uttarakhand",
    "lat": 30.0668,
    "lng": 78.4593,
    "basin": "Tehri Garhwal Sub-basin & Alaknanda, Bhagirathi & Ganga Outflow",
    "threat": "MONITOR"
  },
  {
    "id": "ut_udham_singh_nagar",
    "name": "Udham Singh Nagar",
    "state": "Uttarakhand",
    "lat": 30.3468,
    "lng": 78.4593,
    "basin": "Udham Singh Nagar Sub-basin & Alaknanda, Bhagirathi & Ganga Outflow",
    "threat": "ELEVATED"
  },
  {
    "id": "ut_uttarkashi",
    "name": "Uttarkashi",
    "state": "Uttarakhand",
    "lat": 30.6268,
    "lng": 78.4593,
    "basin": "Uttarkashi Sub-basin & Alaknanda, Bhagirathi & Ganga Outflow",
    "threat": "ELEVATED"
  },
  {
    "id": "we_alipurduar",
    "name": "Alipurduar",
    "state": "West Bengal",
    "lat": 22.1468,
    "lng": 87.015,
    "basin": "Alipurduar Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "ELEVATED"
  },
  {
    "id": "we_bankura",
    "name": "Bankura",
    "state": "West Bengal",
    "lat": 22.4268,
    "lng": 87.015,
    "basin": "Bankura Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "MONITOR"
  },
  {
    "id": "we_birbhum",
    "name": "Birbhum",
    "state": "West Bengal",
    "lat": 22.7068,
    "lng": 87.015,
    "basin": "Birbhum Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "CRITICAL"
  },
  {
    "id": "we_cooch_behar",
    "name": "Cooch Behar",
    "state": "West Bengal",
    "lat": 22.9868,
    "lng": 87.015,
    "basin": "Cooch Behar Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "MONITOR"
  },
  {
    "id": "we_dakshin_dinajpur",
    "name": "Dakshin Dinajpur",
    "state": "West Bengal",
    "lat": 23.2668,
    "lng": 87.015,
    "basin": "Dakshin Dinajpur Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "MONITOR"
  },
  {
    "id": "we_darjeeling",
    "name": "Darjeeling",
    "state": "West Bengal",
    "lat": 23.5468,
    "lng": 87.015,
    "basin": "Darjeeling Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "CRITICAL"
  },
  {
    "id": "we_hooghly",
    "name": "Hooghly",
    "state": "West Bengal",
    "lat": 23.8268,
    "lng": 87.015,
    "basin": "Hooghly Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "ELEVATED"
  },
  {
    "id": "we_howrah",
    "name": "Howrah",
    "state": "West Bengal",
    "lat": 22.1468,
    "lng": 87.295,
    "basin": "Howrah Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "ELEVATED"
  },
  {
    "id": "we_jalpaiguri",
    "name": "Jalpaiguri",
    "state": "West Bengal",
    "lat": 22.4268,
    "lng": 87.295,
    "basin": "Jalpaiguri Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "CRITICAL"
  },
  {
    "id": "we_jhargram",
    "name": "Jhargram",
    "state": "West Bengal",
    "lat": 22.7068,
    "lng": 87.295,
    "basin": "Jhargram Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "MONITOR"
  },
  {
    "id": "we_kalimpong",
    "name": "Kalimpong",
    "state": "West Bengal",
    "lat": 22.9868,
    "lng": 87.295,
    "basin": "Kalimpong Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "ELEVATED"
  },
  {
    "id": "we_kolkata",
    "name": "Kolkata",
    "state": "West Bengal",
    "lat": 23.2668,
    "lng": 87.295,
    "basin": "Kolkata Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "CRITICAL"
  },
  {
    "id": "we_malda",
    "name": "Malda",
    "state": "West Bengal",
    "lat": 23.5468,
    "lng": 87.295,
    "basin": "Malda Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "MONITOR"
  },
  {
    "id": "we_murshidabad",
    "name": "Murshidabad",
    "state": "West Bengal",
    "lat": 23.8268,
    "lng": 87.295,
    "basin": "Murshidabad Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "CRITICAL"
  },
  {
    "id": "we_nadia",
    "name": "Nadia",
    "state": "West Bengal",
    "lat": 22.1468,
    "lng": 87.575,
    "basin": "Nadia Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "ELEVATED"
  },
  {
    "id": "we_north_24_parganas",
    "name": "North 24 Parganas",
    "state": "West Bengal",
    "lat": 22.4268,
    "lng": 87.575,
    "basin": "North 24 Parganas Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "MONITOR"
  },
  {
    "id": "we_paschim_bardhaman",
    "name": "Paschim Bardhaman",
    "state": "West Bengal",
    "lat": 22.7068,
    "lng": 87.575,
    "basin": "Paschim Bardhaman Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "CRITICAL"
  },
  {
    "id": "we_paschim_medinipur",
    "name": "Paschim Medinipur",
    "state": "West Bengal",
    "lat": 22.9868,
    "lng": 87.575,
    "basin": "Paschim Medinipur Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "ELEVATED"
  },
  {
    "id": "we_purba_bardhaman",
    "name": "Purba Bardhaman",
    "state": "West Bengal",
    "lat": 23.2668,
    "lng": 87.575,
    "basin": "Purba Bardhaman Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "CRITICAL"
  },
  {
    "id": "we_purba_medinipur",
    "name": "Purba Medinipur",
    "state": "West Bengal",
    "lat": 23.5468,
    "lng": 87.575,
    "basin": "Purba Medinipur Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "ELEVATED"
  },
  {
    "id": "we_purulia",
    "name": "Purulia",
    "state": "West Bengal",
    "lat": 23.8268,
    "lng": 87.575,
    "basin": "Purulia Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "CRITICAL"
  },
  {
    "id": "we_south_24_parganas",
    "name": "South 24 Parganas",
    "state": "West Bengal",
    "lat": 22.1468,
    "lng": 87.855,
    "basin": "South 24 Parganas Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "MONITOR"
  },
  {
    "id": "we_uttar_dinajpur",
    "name": "Uttar Dinajpur",
    "state": "West Bengal",
    "lat": 22.4268,
    "lng": 87.855,
    "basin": "Uttar Dinajpur Sub-basin & Hooghly, Teesta & Damodar Delta",
    "threat": "CRITICAL"
  },
  {
    "id": "an_nicobar",
    "name": "Nicobar",
    "state": "Andaman & Nicobar",
    "lat": 10.9001,
    "lng": 91.8186,
    "basin": "Nicobar Sub-basin & Bay of Bengal Island Cyclone Surge",
    "threat": "ELEVATED"
  },
  {
    "id": "an_north_and_middle_andaman",
    "name": "North and Middle Andaman",
    "state": "Andaman & Nicobar",
    "lat": 11.1801,
    "lng": 91.8186,
    "basin": "North and Middle Andaman Sub-basin & Bay of Bengal Island Cyclone Surge",
    "threat": "ELEVATED"
  },
  {
    "id": "an_south_andaman",
    "name": "South Andaman",
    "state": "Andaman & Nicobar",
    "lat": 11.4601,
    "lng": 91.8186,
    "basin": "South Andaman Sub-basin & Bay of Bengal Island Cyclone Surge",
    "threat": "CRITICAL"
  },
  {
    "id": "ch_chandigarh",
    "name": "Chandigarh",
    "state": "Chandigarh",
    "lat": 29.8933,
    "lng": 75.9394,
    "basin": "Chandigarh Sub-basin & Sukhna Lake & Ghaggar Catchment",
    "threat": "ELEVATED"
  },
  {
    "id": "da_dadra_and_nagar_haveli",
    "name": "Dadra and Nagar Haveli",
    "state": "Dadra and Nagar Haveli and Daman and Diu",
    "lat": 19.5883,
    "lng": 72.0197,
    "basin": "Dadra and Nagar Haveli Sub-basin & Damanganga River & Arabian Sea",
    "threat": "ELEVATED"
  },
  {
    "id": "da_daman",
    "name": "Daman",
    "state": "Dadra and Nagar Haveli and Daman and Diu",
    "lat": 19.8683,
    "lng": 72.0197,
    "basin": "Daman Sub-basin & Damanganga River & Arabian Sea",
    "threat": "CRITICAL"
  },
  {
    "id": "da_diu",
    "name": "Diu",
    "state": "Dadra and Nagar Haveli and Daman and Diu",
    "lat": 20.1483,
    "lng": 72.0197,
    "basin": "Diu Sub-basin & Damanganga River & Arabian Sea",
    "threat": "MONITOR"
  },
  {
    "id": "de_central_delhi",
    "name": "Central Delhi",
    "state": "Delhi NCR",
    "lat": 27.8641,
    "lng": 76.2625,
    "basin": "Central Delhi Sub-basin & Yamuna River Floodplain & Najafgarh Drain",
    "threat": "ELEVATED"
  },
  {
    "id": "de_east_delhi",
    "name": "East Delhi",
    "state": "Delhi NCR",
    "lat": 28.1441,
    "lng": 76.2625,
    "basin": "East Delhi Sub-basin & Yamuna River Floodplain & Najafgarh Drain",
    "threat": "MONITOR"
  },
  {
    "id": "de_new_delhi",
    "name": "New Delhi",
    "state": "Delhi NCR",
    "lat": 28.4241,
    "lng": 76.2625,
    "basin": "New Delhi Sub-basin & Yamuna River Floodplain & Najafgarh Drain",
    "threat": "MONITOR"
  },
  {
    "id": "de_north_delhi",
    "name": "North Delhi",
    "state": "Delhi NCR",
    "lat": 28.7041,
    "lng": 76.2625,
    "basin": "North Delhi Sub-basin & Yamuna River Floodplain & Najafgarh Drain",
    "threat": "MONITOR"
  },
  {
    "id": "de_north_east_delhi",
    "name": "North East Delhi",
    "state": "Delhi NCR",
    "lat": 28.9841,
    "lng": 76.2625,
    "basin": "North East Delhi Sub-basin & Yamuna River Floodplain & Najafgarh Drain",
    "threat": "MONITOR"
  },
  {
    "id": "de_north_west_delhi",
    "name": "North West Delhi",
    "state": "Delhi NCR",
    "lat": 29.2641,
    "lng": 76.2625,
    "basin": "North West Delhi Sub-basin & Yamuna River Floodplain & Najafgarh Drain",
    "threat": "CRITICAL"
  },
  {
    "id": "de_shahdara",
    "name": "Shahdara",
    "state": "Delhi NCR",
    "lat": 29.5441,
    "lng": 76.2625,
    "basin": "Shahdara Sub-basin & Yamuna River Floodplain & Najafgarh Drain",
    "threat": "MONITOR"
  },
  {
    "id": "de_south_delhi",
    "name": "South Delhi",
    "state": "Delhi NCR",
    "lat": 27.8641,
    "lng": 76.5425,
    "basin": "South Delhi Sub-basin & Yamuna River Floodplain & Najafgarh Drain",
    "threat": "CRITICAL"
  },
  {
    "id": "de_south_east_delhi",
    "name": "South East Delhi",
    "state": "Delhi NCR",
    "lat": 28.1441,
    "lng": 76.5425,
    "basin": "South East Delhi Sub-basin & Yamuna River Floodplain & Najafgarh Drain",
    "threat": "CRITICAL"
  },
  {
    "id": "de_south_west_delhi",
    "name": "South West Delhi",
    "state": "Delhi NCR",
    "lat": 28.4241,
    "lng": 76.5425,
    "basin": "South West Delhi Sub-basin & Yamuna River Floodplain & Najafgarh Drain",
    "threat": "ELEVATED"
  },
  {
    "id": "de_west_delhi",
    "name": "West Delhi",
    "state": "Delhi NCR",
    "lat": 28.7041,
    "lng": 76.5425,
    "basin": "West Delhi Sub-basin & Yamuna River Floodplain & Najafgarh Drain",
    "threat": "MONITOR"
  },
  {
    "id": "ja_anantnag",
    "name": "Anantnag",
    "state": "Jammu & Kashmir",
    "lat": 32.9382,
    "lng": 75.7362,
    "basin": "Anantnag Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "ja_bandipora",
    "name": "Bandipora",
    "state": "Jammu & Kashmir",
    "lat": 33.2182,
    "lng": 75.7362,
    "basin": "Bandipora Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "ELEVATED"
  },
  {
    "id": "ja_baramulla",
    "name": "Baramulla",
    "state": "Jammu & Kashmir",
    "lat": 33.4982,
    "lng": 75.7362,
    "basin": "Baramulla Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "ja_budgam",
    "name": "Budgam",
    "state": "Jammu & Kashmir",
    "lat": 33.7782,
    "lng": 75.7362,
    "basin": "Budgam Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "CRITICAL"
  },
  {
    "id": "ja_doda",
    "name": "Doda",
    "state": "Jammu & Kashmir",
    "lat": 34.0582,
    "lng": 75.7362,
    "basin": "Doda Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "ja_ganderbal",
    "name": "Ganderbal",
    "state": "Jammu & Kashmir",
    "lat": 34.3382,
    "lng": 75.7362,
    "basin": "Ganderbal Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "ja_jammu",
    "name": "Jammu",
    "state": "Jammu & Kashmir",
    "lat": 34.6182,
    "lng": 75.7362,
    "basin": "Jammu Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "ja_kathua",
    "name": "Kathua",
    "state": "Jammu & Kashmir",
    "lat": 32.9382,
    "lng": 76.0162,
    "basin": "Kathua Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "ELEVATED"
  },
  {
    "id": "ja_kishtwar",
    "name": "Kishtwar",
    "state": "Jammu & Kashmir",
    "lat": 33.2182,
    "lng": 76.0162,
    "basin": "Kishtwar Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "ELEVATED"
  },
  {
    "id": "ja_kulgam",
    "name": "Kulgam",
    "state": "Jammu & Kashmir",
    "lat": 33.4982,
    "lng": 76.0162,
    "basin": "Kulgam Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "CRITICAL"
  },
  {
    "id": "ja_kupwara",
    "name": "Kupwara",
    "state": "Jammu & Kashmir",
    "lat": 33.7782,
    "lng": 76.0162,
    "basin": "Kupwara Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "ja_poonch",
    "name": "Poonch",
    "state": "Jammu & Kashmir",
    "lat": 34.0582,
    "lng": 76.0162,
    "basin": "Poonch Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "ja_pulwama",
    "name": "Pulwama",
    "state": "Jammu & Kashmir",
    "lat": 34.3382,
    "lng": 76.0162,
    "basin": "Pulwama Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "ELEVATED"
  },
  {
    "id": "ja_rajouri",
    "name": "Rajouri",
    "state": "Jammu & Kashmir",
    "lat": 34.6182,
    "lng": 76.0162,
    "basin": "Rajouri Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "ja_ramban",
    "name": "Ramban",
    "state": "Jammu & Kashmir",
    "lat": 32.9382,
    "lng": 76.2962,
    "basin": "Ramban Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "ja_reasi",
    "name": "Reasi",
    "state": "Jammu & Kashmir",
    "lat": 33.2182,
    "lng": 76.2962,
    "basin": "Reasi Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "ja_samba",
    "name": "Samba",
    "state": "Jammu & Kashmir",
    "lat": 33.4982,
    "lng": 76.2962,
    "basin": "Samba Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "CRITICAL"
  },
  {
    "id": "ja_shopian",
    "name": "Shopian",
    "state": "Jammu & Kashmir",
    "lat": 33.7782,
    "lng": 76.2962,
    "basin": "Shopian Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "CRITICAL"
  },
  {
    "id": "ja_srinagar",
    "name": "Srinagar",
    "state": "Jammu & Kashmir",
    "lat": 34.0582,
    "lng": 76.2962,
    "basin": "Srinagar Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "MONITOR"
  },
  {
    "id": "ja_udhampur",
    "name": "Udhampur",
    "state": "Jammu & Kashmir",
    "lat": 34.3382,
    "lng": 76.2962,
    "basin": "Udhampur Sub-basin & Jhelum, Chenab & Tawi River Valley",
    "threat": "CRITICAL"
  },
  {
    "id": "la_kargil",
    "name": "Kargil",
    "state": "Ladakh",
    "lat": 33.3126,
    "lng": 76.7371,
    "basin": "Kargil Sub-basin & Indus River & Glacial Mountain Torrent",
    "threat": "CRITICAL"
  },
  {
    "id": "la_leh",
    "name": "Leh",
    "state": "Ladakh",
    "lat": 33.5926,
    "lng": 76.7371,
    "basin": "Leh Sub-basin & Indus River & Glacial Mountain Torrent",
    "threat": "ELEVATED"
  },
  {
    "id": "la_lakshadweep",
    "name": "Lakshadweep",
    "state": "Lakshadweep",
    "lat": 9.7267,
    "lng": 71.8017,
    "basin": "Lakshadweep Sub-basin & Arabian Sea Coral Reef Overwash",
    "threat": "MONITOR"
  },
  {
    "id": "pu_karaikal",
    "name": "Karaikal",
    "state": "Puducherry",
    "lat": 11.1016,
    "lng": 78.9683,
    "basin": "Karaikal Sub-basin & Coromandel Coastal Cyclone Surge",
    "threat": "MONITOR"
  },
  {
    "id": "pu_mahe",
    "name": "Mahe",
    "state": "Puducherry",
    "lat": 11.3816,
    "lng": 78.9683,
    "basin": "Mahe Sub-basin & Coromandel Coastal Cyclone Surge",
    "threat": "MONITOR"
  },
  {
    "id": "pu_puducherry",
    "name": "Puducherry",
    "state": "Puducherry",
    "lat": 11.6616,
    "lng": 78.9683,
    "basin": "Puducherry Sub-basin & Coromandel Coastal Cyclone Surge",
    "threat": "CRITICAL"
  },
  {
    "id": "pu_yanam",
    "name": "Yanam",
    "state": "Puducherry",
    "lat": 11.9416,
    "lng": 78.9683,
    "basin": "Yanam Sub-basin & Coromandel Coastal Cyclone Surge",
    "threat": "MONITOR"
  }
];
