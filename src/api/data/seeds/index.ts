import { sqldb } from "..";

export async function seedUp() {
  console.log("Seeding");

  await sqldb("user").update({ roles: "User" }).whereRaw("1=1");
  await sqldb("user").update({ roles: "Admin" }).where({ email: "Max.parker@yukon.ca" });
  await sqldb("user").update({ roles: "Admin" }).where({ email: "dpdavids@ynet.gov.yk.ca" });

  await sqldb("roles").delete().whereRaw("1=1");
  await sqldb("roles").insert([
    {
      name: "Admin"
    },
    {
      name: "User"
    },
    {
      name: "PatAdmin"
    },
    {
      name: "DeptAdmin"
    },
    {
      name: "TdUser"
    }
  ]);

  await sqldb("travelPurpose").delete().whereRaw("1=1");
  await sqldb("travelPurpose").insert([
    {
      purpose: "Maintenance"
    },
    {
      purpose: "Conference"
    },
    {
      purpose: "Workshop"
    },
    {
      purpose: "General Travel"
    },
    {
      purpose: "Community Travel"
    }
  ]);

  await sqldb("transportMethod").delete().whereRaw("1=1");
  await sqldb("transportMethod").insert([
    {
      method: "Rental vehicle"
    },
    {
      method: "Personal vehicle"
    },
    {
      method: "Fleet vehicle"
    },
    {
      method: "Plane"
    }
  ]);

  await sqldb("destinations").delete().whereRaw("1=1");
  await sqldb("destinations").insert([
    {
      province: "YT",
      city: "Whitehorse"
    },
    {
      province: "BC",
      city: "Vancouver"
    },
    {
      province: "AB",
      city: "Airdrie"
    },
    {
      province: "AB",
      city: "Grande Prairie"
    },
    {
      province: "AB",
      city: "Red Deer"
    },
    {
      province: "AB",
      city: "Beaumont"
    },
    {
      province: "AB",
      city: "Hanna"
    },
    {
      province: "AB",
      city: "St. Albert"
    },
    {
      province: "AB",
      city: "Bonnyville"
    },
    {
      province: "AB",
      city: "Hinton"
    },
    {
      province: "AB",
      city: "Spruce Grove"
    },
    {
      province: "AB",
      city: "Brazeau"
    },
    {
      province: "AB",
      city: "Irricana"
    },
    {
      province: "AB",
      city: "Strathcona County"
    },
    {
      province: "AB",
      city: "Breton"
    },
    {
      province: "AB",
      city: "Lacombe"
    },
    {
      province: "AB",
      city: "Strathmore"
    },
    {
      province: "AB",
      city: "Calgary"
    },
    {
      province: "AB",
      city: "Leduc"
    },
    {
      province: "AB",
      city: "Sylvan Lake"
    },
    {
      province: "AB",
      city: "Camrose"
    },
    {
      province: "AB",
      city: "Lethbridge"
    },
    {
      province: "AB",
      city: "Swan Hills"
    },
    {
      province: "AB",
      city: "Canmore"
    },
    {
      province: "AB",
      city: "McLennan"
    },
    {
      province: "AB",
      city: "Taber"
    },
    {
      province: "AB",
      city: "Didzbury"
    },
    {
      province: "AB",
      city: "Medicine Hat"
    },
    {
      province: "AB",
      city: "Turner Valley"
    },
    {
      province: "AB",
      city: "Drayton Valley"
    },
    {
      province: "AB",
      city: "Olds"
    },
    {
      province: "AB",
      city: "Vermillion"
    },
    {
      province: "AB",
      city: "Edmonton"
    },
    {
      province: "AB",
      city: "Onoway"
    },
    {
      province: "AB",
      city: "Wood Buffalo"
    },
    {
      province: "AB",
      city: "Ft. SK"
    },
    {
      province: "AB",
      city: "Provost"
    },
    {
      province: "BC",
      city: "Burnaby"
    },
    {
      province: "BC",
      city: "Lumby"
    },
    {
      province: "BC",
      city: "City of Port Moody"
    },
    {
      province: "BC",
      city: "Cache Creek"
    },
    {
      province: "BC",
      city: "Maple Ridge"
    },
    {
      province: "BC",
      city: "Prince George"
    },
    {
      province: "BC",
      city: "Castlegar"
    },
    {
      province: "BC",
      city: "Merritt"
    },
    {
      province: "BC",
      city: "Prince Rupert"
    },
    {
      province: "BC",
      city: "Chemainus"
    },
    {
      province: "BC",
      city: "Mission"
    },
    {
      province: "BC",
      city: "Richmond"
    },
    {
      province: "BC",
      city: "Chilliwack"
    },
    {
      province: "BC",
      city: "Nanaimo"
    },
    {
      province: "BC",
      city: "Saanich"
    },
    {
      province: "BC",
      city: "Clearwater"
    },
    {
      province: "BC",
      city: "Nelson"
    },
    {
      province: "BC",
      city: "Sooke"
    },
    {
      province: "BC",
      city: "Colwood"
    },
    {
      province: "BC",
      city: "New Westminster"
    },
    {
      province: "BC",
      city: "Sparwood"
    },
    {
      province: "BC",
      city: "Coquitlam"
    },
    {
      province: "BC",
      city: "North Cowichan"
    },
    {
      province: "BC",
      city: "Surrey"
    },
    {
      province: "BC",
      city: "Cranbrook"
    },
    {
      province: "BC",
      city: "North Vancouver"
    },
    {
      province: "BC",
      city: "Terrace"
    },
    {
      province: "BC",
      city: "Dawson Creek"
    },
    {
      province: "BC",
      city: "Tumbler"
    },
    {
      province: "BC",
      city: "Delta"
    },
    {
      province: "BC",
      city: "Osoyoos"
    },
    {
      province: "BC",
      city: "Fernie"
    },
    {
      province: "BC",
      city: "Parksville"
    },
    {
      province: "BC",
      city: "Invermere"
    },
    {
      province: "BC",
      city: "Peace River"
    },
    {
      province: "BC",
      city: "Vernon"
    },
    {
      province: "BC",
      city: "Kamloops"
    },
    {
      province: "BC",
      city: "Penticton"
    },
    {
      province: "BC",
      city: "Victoria"
    },
    {
      province: "BC",
      city: "Kaslo"
    },
    {
      province: "BC",
      city: "Port Alberni"
    },
    {
      province: "BC",
      city: "Whistler"
    },
    {
      province: "BC",
      city: "Langley"
    },
    {
      province: "BC",
      city: "Port Hardy"
    },
    {
      province: "MB",
      city: "Birtle"
    },
    {
      province: "MB",
      city: "Flin Flon"
    },
    {
      province: "MB",
      city: "Swan River"
    },
    {
      province: "MB",
      city: "Brandon"
    },
    {
      province: "MB",
      city: "Snow Lake"
    },
    {
      province: "MB",
      city: "The Pas"
    },
    {
      province: "MB",
      city: "Cranberry Portage"
    },
    {
      province: "MB",
      city: "Steinbach"
    },
    {
      province: "MB",
      city: "Thompson"
    },
    {
      province: "MB",
      city: "Dauphin"
    },
    {
      province: "MB",
      city: "Stonewall"
    },
    {
      province: "MB",
      city: "Winnipeg"
    },
    {
      province: "NB",
      city: "Cap-Pele"
    },
    {
      province: "NB",
      city: "Miramichi"
    },
    {
      province: "NB",
      city: "Saint John"
    },
    {
      province: "NB",
      city: "Fredericton"
    },
    {
      province: "NB",
      city: "Moncton"
    },
    {
      province: "NB",
      city: "Saint Stephen"
    },
    {
      province: "NB",
      city: "Grand Bay-Westfield"
    },
    {
      province: "NB",
      city: "Oromocto"
    },
    {
      province: "NB",
      city: "Shippagan"
    },
    {
      province: "NB",
      city: "Grand Falls"
    },
    {
      province: "NB",
      city: "Port Elgin"
    },
    {
      province: "NB",
      city: "Sussex"
    },
    {
      province: "NB",
      city: "Memramcook"
    },
    {
      province: "NB",
      city: "Sackville"
    },
    {
      province: "NB",
      city: "Tracadie-Sheila"
    },
    {
      province: "NL",
      city: "Argentia"
    },
    {
      province: "NL",
      city: "Corner Brook"
    },
    {
      province: "NL",
      city: "Paradise"
    },
    {
      province: "NL",
      city: "Bishop's Falls"
    },
    {
      province: "NL",
      city: "Labrador City"
    },
    {
      province: "NL",
      city: "Portaux Basques"
    },
    {
      province: "NL",
      city: "Botwood"
    },
    {
      province: "NL",
      city: "Mount Pearl"
    },
    {
      province: "NL",
      city: "St. Johnss"
    },
    {
      province: "NL",
      city: "Brigus"
    },
    {
      province: "NT",
      city: "Town of Hay River"
    },
    {
      province: "NT",
      city: "Town of Inuvik"
    },
    {
      province: "NT",
      city: "Yellowknife"
    },
    {
      province: "NS",
      city: "Amherst"
    },
    {
      province: "NS",
      city: "Hants County"
    },
    {
      province: "NS",
      city: "Pictou"
    },
    {
      province: "NS",
      city: "Annapolis"
    },
    {
      province: "NS",
      city: "Inverness County"
    },
    {
      province: "NS",
      city: "Pictou County"
    },
    {
      province: "NS",
      city: "Argyle"
    },
    {
      province: "NS",
      city: "Kentville"
    },
    {
      province: "NS",
      city: "Queens"
    },
    {
      province: "NS",
      city: "Baddeck"
    },
    {
      province: "NS",
      city: "County of Kings"
    },
    {
      province: "NS",
      city: "Richmond"
    },
    {
      province: "NS",
      city: "Bridgewater"
    },
    {
      province: "NS",
      city: "Lunenburg"
    },
    {
      province: "NS",
      city: "Shelburne"
    },
    {
      province: "NS",
      city: "Cape Breton"
    },
    {
      province: "NS",
      city: "Lunenburg County"
    },
    {
      province: "NS",
      city: "Stellarton"
    },
    {
      province: "NS",
      city: "Chester"
    },
    {
      province: "NS",
      city: "Mahone Bay"
    },
    {
      province: "NS",
      city: "Truro"
    },
    {
      province: "NS",
      city: "Cumberland County"
    },
    {
      province: "NS",
      city: "New Glasgow"
    },
    {
      province: "NS",
      city: "Windsor"
    },
    {
      province: "NS",
      city: "East Hants"
    },
    {
      province: "NS",
      city: "New Minas"
    },
    {
      province: "NS",
      city: "Yarmouth"
    },
    {
      province: "NS",
      city: "Halifax"
    },
    {
      province: "NS",
      city: "Parrsboro"
    },
    {
      province: "ON",
      city: "Ajax"
    },
    {
      province: "ON",
      city: "Halton"
    },
    {
      province: "ON",
      city: "Peterborough"
    },
    {
      province: "ON",
      city: "Atikokan"
    },
    {
      province: "ON",
      city: "Halton Hills"
    },
    {
      province: "ON",
      city: "Pickering"
    },
    {
      province: "ON",
      city: "Barrie"
    },
    {
      province: "ON",
      city: "Hamilton"
    },
    {
      province: "ON",
      city: "Port Bruce"
    },
    {
      province: "ON",
      city: "Belleville"
    },
    {
      province: "ON",
      city: "Hamilton-Wentworth"
    },
    {
      province: "ON",
      city: "Port Burwell"
    },
    {
      province: "ON",
      city: "Blandford-Blenheim"
    },
    {
      province: "ON",
      city: "Hearst"
    },
    {
      province: "ON",
      city: "Port Colborne"
    },
    {
      province: "ON",
      city: "Blind River"
    },
    {
      province: "ON",
      city: "Huntsville"
    },
    {
      province: "ON",
      city: "Port Hope"
    },
    {
      province: "ON",
      city: "Brampton"
    },
    {
      province: "ON",
      city: "Ingersoll"
    },
    {
      province: "ON",
      city: "Prince Edward"
    },
    {
      province: "ON",
      city: "Brant"
    },
    {
      province: "ON",
      city: "James"
    },
    {
      province: "ON",
      city: "Quinte West"
    },
    {
      province: "ON",
      city: "Brantford"
    },
    {
      province: "ON",
      city: "Kanata"
    },
    {
      province: "ON",
      city: "Renfrew"
    },
    {
      province: "ON",
      city: "Brock"
    },
    {
      province: "ON",
      city: "Kincardine"
    },
    {
      province: "ON",
      city: "Richmond Hill"
    },
    {
      province: "ON",
      city: "Brockville"
    },
    {
      province: "ON",
      city: "King"
    },
    {
      province: "ON",
      city: "Sarnia"
    },
    {
      province: "ON",
      city: "Burlington"
    },
    {
      province: "ON",
      city: "Kingston"
    },
    {
      province: "ON",
      city: "Sault Ste. Marie"
    },
    {
      province: "ON",
      city: "Caledon"
    },
    {
      province: "ON",
      city: "Kirkland Lake"
    },
    {
      province: "ON",
      city: "Scarborough"
    },
    {
      province: "ON",
      city: "Cambridge"
    },
    {
      province: "ON",
      city: "Kitchener"
    },
    {
      province: "ON",
      city: "Scugog"
    },
    {
      province: "ON",
      city: "Chatham-Kent"
    },
    {
      province: "ON",
      city: "Larder Lake"
    },
    {
      province: "ON",
      city: "Souix Lookout CoC Sioux Lookout"
    },
    {
      province: "ON",
      city: "Chesterville"
    },
    {
      province: "ON",
      city: "Leamington"
    },
    {
      province: "ON",
      city: "Smiths Falls"
    },
    {
      province: "ON",
      city: "Clarington"
    },
    {
      province: "ON",
      city: "Lennox-Addington"
    },
    {
      province: "ON",
      city: "South-West Oxford"
    },
    {
      province: "ON",
      city: "Cobourg"
    },
    {
      province: "ON",
      city: "Lincoln"
    },
    {
      province: "ON",
      city: "St. Catharines"
    },
    {
      province: "ON",
      city: "Cochrane"
    },
    {
      province: "ON",
      city: "Lindsay"
    },
    {
      province: "ON",
      city: "St. Thomas"
    },
    {
      province: "ON",
      city: "Collingwood"
    },
    {
      province: "ON",
      city: "London"
    },
    {
      province: "ON",
      city: "Stoney Creek"
    },
    {
      province: "ON",
      city: "Cornwall"
    },
    {
      province: "ON",
      city: "Loyalist Township"
    },
    {
      province: "ON",
      city: "Stratford"
    },
    {
      province: "ON",
      city: "Cumberland"
    },
    {
      province: "ON",
      city: "Markham"
    },
    {
      province: "ON",
      city: "Sudbury"
    },
    {
      province: "ON",
      city: "Deep River"
    },
    {
      province: "ON",
      city: "Metro Toronto"
    },
    {
      province: "ON",
      city: "Temagami"
    },
    {
      province: "ON",
      city: "Dundas"
    },
    {
      province: "ON",
      city: "Merrickville"
    },
    {
      province: "ON",
      city: "Thorold"
    },
    {
      province: "ON",
      city: "Durham"
    },
    {
      province: "ON",
      city: "Milton"
    },
    {
      province: "ON",
      city: "Thunder Bay"
    },
    {
      province: "ON",
      city: "Dymond"
    },
    {
      province: "ON",
      city: "Nepean"
    },
    {
      province: "ON",
      city: "Tillsonburg"
    },
    {
      province: "ON",
      city: "Ear Falls"
    },
    {
      province: "ON",
      city: "Newmarket"
    },
    {
      province: "ON",
      city: "Timmins"
    },
    {
      province: "ON",
      city: "East Gwillimbury"
    },
    {
      province: "ON",
      city: "Niagara"
    },
    {
      province: "ON",
      city: "Toronto"
    },
    {
      province: "ON",
      city: "East Zorra-Tavistock"
    },
    {
      province: "ON",
      city: "Niagara Falls"
    },
    {
      province: "ON",
      city: "Uxbridge"
    },
    {
      province: "ON",
      city: "Elgin"
    },
    {
      province: "ON",
      city: "Niagara-on-the-Lake"
    },
    {
      province: "ON",
      city: "Vaughan"
    },
    {
      province: "ON",
      city: "Elliot Lake"
    },
    {
      province: "ON",
      city: "North Bay"
    },
    {
      province: "ON",
      city: "Wainfleet"
    },
    {
      province: "ON",
      city: "Flamborough"
    },
    {
      province: "ON",
      city: "North Dorchester"
    },
    {
      province: "ON",
      city: "Wasaga Beach"
    },
    {
      province: "ON",
      city: "Fort Erie"
    },
    {
      province: "ON",
      city: "North Dumfries"
    },
    {
      province: "ON",
      city: "Waterloo"
    },
    {
      province: "ON",
      city: "Fort Frances"
    },
    {
      province: "ON",
      city: "North York"
    },
    {
      province: "ON",
      city: "Waterloo"
    },
    {
      province: "ON",
      city: "Gananoque"
    },
    {
      province: "ON",
      city: "Norwich"
    },
    {
      province: "ON",
      city: "Welland"
    },
    {
      province: "ON",
      city: "Georgina"
    },
    {
      province: "ON",
      city: "Oakville"
    },
    {
      province: "ON",
      city: "Wellesley"
    },
    {
      province: "ON",
      city: "Glanbrook"
    },
    {
      province: "ON",
      city: "Orangeville"
    },
    {
      province: "ON",
      city: "West Carleton"
    },
    {
      province: "ON",
      city: "Gloucester"
    },
    {
      province: "ON",
      city: "Orillia"
    },
    {
      province: "ON",
      city: "West Lincoln"
    },
    {
      province: "ON",
      city: "Goulbourn"
    },
    {
      province: "ON",
      city: "Osgoode"
    },
    {
      province: "ON",
      city: "Whitby"
    },
    {
      province: "ON",
      city: "Gravenhurst"
    },
    {
      province: "ON",
      city: "Oshawa"
    },
    {
      province: "ON",
      city: "Wilmot"
    },
    {
      province: "ON",
      city: "Grimsby"
    },
    {
      province: "ON",
      city: "Ottawa"
    },
    {
      province: "ON",
      city: "Windsor"
    },
    {
      province: "ON",
      city: "Guelph"
    },
    {
      province: "ON",
      city: "Ottawa-Carleton"
    },
    {
      province: "ON",
      city: "Woolwich"
    },
    {
      province: "ON",
      city: "Haldimand-Norfork"
    },
    {
      province: "ON",
      city: "Owen Sound"
    },
    {
      province: "ON",
      city: "York"
    },
    {
      province: "PE",
      city: "Alberton"
    },
    {
      province: "PE",
      city: "Montague"
    },
    {
      province: "PE",
      city: "Stratford"
    },
    {
      province: "PE",
      city: "Charlottetown"
    },
    {
      province: "PE",
      city: "Souris"
    },
    {
      province: "PE",
      city: "Summerside"
    },
    {
      province: "PE",
      city: "Cornwall"
    },
    {
      province: "QC",
      city: "Alma"
    },
    {
      province: "QC",
      city: "Fleurimont"
    },
    {
      province: "QC",
      city: "Longueuil"
    },
    {
      province: "QC",
      city: "Amos"
    },
    {
      province: "QC",
      city: "Gaspe"
    },
    {
      province: "QC",
      city: "Marieville"
    },
    {
      province: "QC",
      city: "Anjou"
    },
    {
      province: "QC",
      city: "Gatineau"
    },
    {
      province: "QC",
      city: "Mount Royal"
    },
    {
      province: "QC",
      city: "Aylmer"
    },
    {
      province: "QC",
      city: "Hull"
    },
    {
      province: "QC",
      city: "Montreal"
    },
    {
      province: "QC",
      city: "Beauport"
    },
    {
      province: "QC",
      city: "Joliette"
    },
    {
      province: "QC",
      city: "Montreal Region"
    },
    {
      province: "QC",
      city: "Bromptonville"
    },
    {
      province: "QC",
      city: "Jonquiere"
    },
    {
      province: "QC",
      city: "Montreal-Est"
    },
    {
      province: "QC",
      city: "Brosssard"
    },
    {
      province: "QC",
      city: "Lachine"
    },
    {
      province: "QC",
      city: "Quebec"
    },
    {
      province: "QC",
      city: "Chateauguay"
    },
    {
      province: "QC",
      city: "Lasalle"
    },
    {
      province: "QC",
      city: "Saint-Leonard"
    },
    {
      province: "QC",
      city: "Chicoutimi"
    },
    {
      province: "QC",
      city: "Laurentides"
    },
    {
      province: "QC",
      city: "Sherbrooke"
    },
    {
      province: "QC",
      city: "Coaticook"
    },
    {
      province: "QC",
      city: "LaSalle"
    },
    {
      province: "QC",
      city: "Sorel"
    },
    {
      province: "QC",
      city: "Coaticook"
    },
    {
      province: "QC",
      city: "Laval"
    },
    {
      province: "QC",
      city: "Thetford Mines"
    },
    {
      province: "QC",
      city: "Dorval"
    },
    {
      province: "QC",
      city: "Lennoxville"
    },
    {
      province: "QC",
      city: "Victoriaville"
    },
    {
      province: "QC",
      city: "Drummondville"
    },
    {
      province: "QC",
      city: "Levis"
    },
    {
      province: "SK",
      city: "Avonlea"
    },
    {
      province: "SK",
      city: "Melfort"
    },
    {
      province: "SK",
      city: "Swift Current"
    },
    {
      province: "SK",
      city: "Colonsay"
    },
    {
      province: "SK",
      city: "Nipawin"
    },
    {
      province: "SK",
      city: "Tisdale"
    },
    {
      province: "SK",
      city: "Craik"
    },
    {
      province: "SK",
      city: "Prince Albert"
    },
    {
      province: "SK",
      city: "Unity"
    },
    {
      province: "SK",
      city: "Creighton"
    },
    {
      province: "SK",
      city: "Regina"
    },
    {
      province: "SK",
      city: "Weyburn"
    },
    {
      province: "SK",
      city: "Eastend"
    },
    {
      province: "SK",
      city: "Saskatoon"
    },
    {
      province: "SK",
      city: "Wynyard"
    },
    {
      province: "SK",
      city: "Esterhazy"
    },
    {
      province: "SK",
      city: "Shell Lake"
    },
    {
      province: "SK",
      city: "Yorkton"
    },
    {
      province: "SK",
      city: "Gravelbourg"
    },
    {
      province: "YT",
      city: "Carcross"
    },
    {
      province: "YT",
      city: "Dawson"
    },
    {
      province: "YT",
      city: "Faro"
    },
    {
      province: "YT",
      city: "Haines Junction"
    },
    {
      province: "YT",
      city: "Mayo"
    },
    {
      province: "YT",
      city: "Teslin"
    },
    {
      province: "YT",
      city: "Watson Lake"
    },
    {
      province: "YT",
      city: "Old Crow"
    },
    {
      province: "YT",
      city: "Otter Falls"
    },
    {
      province: "YT",
      city: "Ealge Plains"
    },
    {
      province: "YT",
      city: "Salmon Arm"
    }
  ]);

  // INSERT INTO public.forms ("userId","firstName","lastName",department,division,branch,unit,email,mailcode,"daysOffTravelStatus","dateBackToWork","travelDuration",purpose,"travelAdvance","eventName",summary,benefits,status,"formId","supervisorEmail","preappId",approved,"requestChange","denialReason","oneWayTrip","multiStop","createdBy") VALUES
  //  (2,'Max','Parker','Highways and Public Works',NULL,NULL,NULL,'max.parker@yukon.ca',NULL,NULL,'2023-03-18',10,'Conference',1,'Global Biotechnology Summit',NULL,NULL,'Approved','1',NULL,1,NULL,NULL,NULL,false,true,NULL),
  //  (2,'Max','Parker','Highways and Public Works',NULL,NULL,NULL,'max.parker@yukon.ca',NULL,NULL,'2023-03-20',3,'Conference',1,'Gelobal  IT',NULL,NULL,'Approved','3',NULL,3,NULL,NULL,NULL,false,true,NULL),
  //  (1,'Hassan','Anvar','Highways and Public Works',NULL,NULL,NULL,'hassan.anvar@pacificintelligent.com',NULL,NULL,'2023-03-22',2,'Conference',1,'Gelobal  IT',NULL,NULL,'Approved','4',NULL,4,NULL,NULL,NULL,false,true,NULL),
  //  (2,'Jeff','Barnhardt','Highways and Public Works',NULL,NULL,NULL,'jeff.barnhardt@yukon.ca',NULL,NULL,'2023-03-25',5,'Conference',1,'Gelobal IT',NULL,NULL,'Approved','2',NULL,2,NULL,NULL,NULL,false,true,NULL);
  //  INSERT INTO public.stops (taid,"locationId","departureDate","departureTime",transport) VALUES
  //  (4,405,'2023-03-22','08:00:00','Plane'),
  //  (1,436,'2023-03-12','12:00:00','Plane'),
  //  (1,431,'2023-03-12','16:00:00','Plane'),
  //  (2,445,'2023-03-20','08:00:00','Plane'),
  //  (3,585,'2023-03-20','09:00:00','Plane');

  await sqldb("forms").delete().whereRaw("1=1");
  await sqldb("forms").insert([
    {
      userId: 1,
      firstName: "John",
      lastName: "Doe",
      department: "IT",
      division: "IT",
      branch: "IT",
      unit: "IT",
      email: "Max.parker@yukon.ca",
      mailcode: "123",
      daysOffTravelStatus: 1,
      dateBackToWork: "2019-01-01",
      travelDuration: 1,
      purpose: "IT",
      travelAdvance: 4,
      eventName: "An Event",
      summary: "Summary",
      benefits: "Benefits",
      status: "Approved",
      formId: "2c2db7f4-5711-40c8-bd54-a6b7ad306319",
      supervisorEmail: "dpdavids@ynet.gov.yk.ca",
      preappId: 1,
      approved: "",
      requestChange: "",
      denialReason: "",
      oneWayTrip: true,
      multiStop: true,
      createdBy: 1
    },
    {
      userId: 1,
      firstName: "Jane",
      lastName: "Doe",
      department: "IT",
      division: "IT",
      branch: "IT",
      unit: "IT",
      email: "Max.parker@yukon.ca",
      mailcode: "123",
      daysOffTravelStatus: 1,
      dateBackToWork: "2019-01-01",
      travelDuration: 1,
      purpose: "IT",
      travelAdvance: 4,
      eventName: "An Event",
      summary: "Summary",
      benefits: "Benefits",
      status: "Approved",
      formId: "2c2db7f4-5711-40c8-bd54-a6b7ad306311",
      supervisorEmail: "dpdavids@ynet.gov.yk.ca",
      preappId: 2,
      approved: "",
      requestChange: "",
      denialReason: "",
      oneWayTrip: true,
      multiStop: true,
      createdBy: 1
    },
    {
      userId: 1,
      firstName: "Some Other",
      lastName: "Guy",
      department: "IT",
      division: "IT",
      branch: "IT",
      unit: "IT",
      email: "Max.parker@yukon.ca",
      mailcode: "123",
      daysOffTravelStatus: 1,
      dateBackToWork: "2019-01-01",
      travelDuration: 1,
      purpose: "IT",
      travelAdvance: 4,
      eventName: "An Event",
      summary: "Summary",
      benefits: "Benefits",
      status: "Approved",
      formId: "2c2db7f4-5711-40c8-bd54-a6b7ad306312",
      supervisorEmail: "dpdavids@ynet.gov.yk.ca",
      preappId: 3,
      approved: "",
      requestChange: "",
      denialReason: "",
      oneWayTrip: true,
      multiStop: true,
      createdBy: 1
    }
  ]);

  // t.increments("id").notNullable().primary();
  // t.integer("taid").notNullable();
  // t.integer("locationId");
  // t.specificType("departureDate", "DATE");
  // t.time("departureTime");
  // t.string("transport");

  await sqldb("stops").delete().whereRaw("1=1");
  await sqldb("stops").insert([
    {
      taid: 1,
      locationId: 1,
      departureDate: "2023-05-12",
      departureTime: "12:00:00",
      transport: "Plane"
    },
    {
      taid: 1,
      locationId: 2,
      departureDate: "2019-05-15",
      departureTime: "12:00:00",
      transport: "Plane"
    },
    {
      taid: 2,
      locationId: 3,
      departureDate: "2023-05-12",
      departureTime: "12:00:00",
      transport: "Plane"
    },
    {
      taid: 2,
      locationId: 4,
      departureDate: "2019-05-15",
      departureTime: "12:00:00",
      transport: "Plane"
    },
    {
      taid: 3,
      locationId: 5,
      departureDate: "2023-05-12",
      departureTime: "12:00:00",
      transport: "Plane"
    },
    {
      taid: 3,
      locationId: 6,
      departureDate: "2019-05-15",
      departureTime: "12:00:00",
      transport: "Plane"
    }
  ]);

  await sqldb("travelDeskTravelRequest").delete().whereRaw("1=1");

  return "Done";
}
