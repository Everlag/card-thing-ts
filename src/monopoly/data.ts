// I'd prefer if we could trivially use webpack to just
// import the json file but thats a lot of yak shaving to get
// vscode to be okay with.
/* tslint:disable */
let raw = `{
    "properties": [
        {
            "name": "Mediterranean Avenue",
            "id": "mediterraneanave",
            "position": 2,
            "price": 60,
            "rent": 2,
            "multpliedrent": [
                10,
                30,
                90,
                160,
                250
            ],
            "housecost": 50,
            "group": "Purple",
            "ohousecost": 50,
            "oprice": 60
        },
        {
            "name": "Baltic Avenue",
            "id": "balticave",
            "position": 4,
            "price": 60,
            "rent": 4,
            "multpliedrent": [
                20,
                60,
                180,
                320,
                450
            ],
            "housecost": 50,
            "group": "Purple",
            "ohousecost": 50,
            "oprice": 60
        },
        {
            "name": "Oriental Avenue",
            "id": "orientalave",
            "position": 7,
            "price": 100,
            "rent": 6,
            "multpliedrent": [
                30,
                90,
                270,
                400,
                550
            ],
            "housecost": 50,
            "group": "Lightgreen",
            "ohousecost": 50,
            "oprice": 100
        },
        {
            "name": "Vermont Avenue",
            "id": "vermontave",
            "position": 9,
            "price": 100,
            "rent": 6,
            "multpliedrent": [
                30,
                90,
                270,
                400,
                550
            ],
            "housecost": 50,
            "group": "Lightgreen",
            "ohousecost": 50,
            "oprice": 100
        },
        {
            "name": "Connecticut Avenue",
            "id": "connecticutave",
            "position": 10,
            "price": 120,
            "rent": 8,
            "multpliedrent": [
                40,
                100,
                300,
                450,
                600
            ],
            "housecost": 50,
            "group": "Lightgreen",
            "ohousecost": 50,
            "oprice": 120
        },
        {
            "name": "St. Charles Place",
            "id": "stcharlesplace",
            "position": 12,
            "price": 140,
            "rent": 10,
            "multpliedrent": [
                50,
                150,
                450,
                625,
                750
            ],
            "housecost": 100,
            "group": "Violet",
            "ohousecost": 100,
            "oprice": 140
        },
        {
            "name": "States Avenue",
            "id": "statesave",
            "position": 14,
            "price": 140,
            "rent": 10,
            "multpliedrent": [
                50,
                150,
                450,
                625,
                750
            ],
            "housecost": 100,
            "group": "Violet",
            "ohousecost": 100,
            "oprice": 140
        },
        {
            "name": "Virginia Avenue",
            "id": "virginiaave",
            "position": 15,
            "price": 160,
            "rent": 12,
            "multpliedrent": [
                60,
                180,
                500,
                700,
                900
            ],
            "housecost": 100,
            "group": "Violet",
            "ohousecost": 100,
            "oprice": 160
        },
        {
            "name": "St. James Place",
            "id": "stjamesplace",
            "position": 17,
            "price": 180,
            "rent": 14,
            "multpliedrent": [
                70,
                200,
                550,
                750,
                950
            ],
            "housecost": 100,
            "group": "Orange",
            "ohousecost": 100,
            "oprice": 180
        },
        {
            "name": "Tennessee Avenue",
            "id": "tennesseeave",
            "position": 19,
            "price": 180,
            "rent": 14,
            "multpliedrent": [
                70,
                200,
                550,
                750,
                950
            ],
            "housecost": 100,
            "group": "Orange",
            "ohousecost": 100,
            "oprice": 180
        },
        {
            "name": "New York Avenue",
            "id": "newyorkave",
            "position": 20,
            "price": 200,
            "rent": 16,
            "multpliedrent": [
                80,
                220,
                600,
                800,
                1000
            ],
            "housecost": 100,
            "group": "Orange",
            "ohousecost": 100,
            "oprice": 200
        },
        {
            "name": "Kentucky Avenue",
            "id": "kentuckyave",
            "position": 22,
            "price": 220,
            "rent": 18,
            "multpliedrent": [
                90,
                250,
                700,
                875,
                1050
            ],
            "housecost": 150,
            "group": "Red",
            "ohousecost": 150,
            "oprice": 220
        },
        {
            "name": "Indiana Avenue",
            "id": "indianaave",
            "position": 24,
            "price": 220,
            "rent": 18,
            "multpliedrent": [
                90,
                250,
                700,
                875,
                1050
            ],
            "housecost": 150,
            "group": "Red",
            "ohousecost": 150,
            "oprice": 220
        },
        {
            "name": "Illinois Avenue",
            "id": "illinoisave",
            "position": 25,
            "price": 240,
            "rent": 20,
            "multpliedrent": [
                100,
                300,
                750,
                925,
                1100
            ],
            "housecost": 150,
            "group": "Red",
            "ohousecost": 150,
            "oprice": 240
        },
        {
            "name": "Atlantic Avenue",
            "id": "atlanticave",
            "position": 27,
            "price": 260,
            "rent": 22,
            "multpliedrent": [
                110,
                330,
                800,
                975,
                1150
            ],
            "housecost": 150,
            "group": "Yellow",
            "ohousecost": 150,
            "oprice": 260
        },
        {
            "name": "Ventnor Avenue",
            "id": "ventnorave",
            "position": 28,
            "price": 260,
            "rent": 22,
            "multpliedrent": [
                110,
                330,
                800,
                975,
                1150
            ],
            "housecost": 150,
            "group": "Yellow",
            "ohousecost": 150,
            "oprice": 260
        },
        {
            "name": "Marvin Gardens",
            "id": "marvingardens",
            "position": 30,
            "price": 280,
            "rent": 22,
            "multpliedrent": [
                120,
                360,
                850,
                1025,
                1200
            ],
            "housecost": 150,
            "group": "Yellow",
            "ohousecost": 150,
            "oprice": 280
        },
        {
            "name": "Pacific Avenue",
            "id": "pacificave",
            "position": 32,
            "price": 300,
            "rent": 26,
            "multpliedrent": [
                130,
                390,
                900,
                1100,
                1275
            ],
            "housecost": 200,
            "group": "Darkgreen",
            "ohousecost": 200,
            "oprice": 300
        },
        {
            "name": "North Carolina Avenue",
            "id": "northcarolinaave",
            "position": 33,
            "price": 300,
            "rent": 26,
            "multpliedrent": [
                130,
                390,
                900,
                1100,
                1275
            ],
            "housecost": 200,
            "group": "Darkgreen",
            "ohousecost": 200,
            "oprice": 300
        },
        {
            "name": "Pennsylvania Avenue",
            "id": "pennsylvaniaave",
            "position": 35,
            "price": 320,
            "rent": 28,
            "multpliedrent": [
                150,
                450,
                1000,
                1200,
                1400
            ],
            "housecost": 200,
            "group": "Darkgreen",
            "ohousecost": 200,
            "oprice": 320
        },
        {
            "name": "Park Place",
            "id": "parkplace",
            "position": 38,
            "price": 350,
            "rent": 35,
            "multpliedrent": [
                175,
                500,
                1100,
                1300,
                1500
            ],
            "housecost": 200,
            "group": "Darkblue",
            "ohousecost": 200,
            "oprice": 350
        },
        {
            "name": "Boardwalk",
            "id": "boardwalk",
            "position": 40,
            "price": 400,
            "rent": 50,
            "multpliedrent": [
                200,
                600,
                1400,
                1700,
                2000
            ],
            "housecost": 200,
            "group": "Darkblue",
            "ohousecost": 200,
            "oprice": 400
        },
        {
            "name": "Electric Company",
            "id": "electriccompany",
            "position": 13,
            "price": 150,
            "group": "Utilities",
            "oprice": 150
        },
        {
            "name": "Water Works",
            "id": "waterworks",
            "position": 29,
            "price": 150,
            "group": "Utilities",
            "oprice": 150
        },
        {
            "name": "Reading Railroad",
            "id": "readingrailroad",
            "position": 6,
            "price": 200,
            "group": "Railroad",
            "oprice": 200
        },
        {
            "name": "Pennsylvania Railroad",
            "id": "pennsylvaniarailroad",
            "position": 16,
            "price": 200,
            "group": "Railroad",
            "oprice": 200
        },
        {
            "name": "B. & O. Railroad",
            "id": "borailroad",
            "position": 26,
            "price": 200,
            "group": "Railroad",
            "oprice": 200
        },
        {
            "name": "Short Line Railroad",
            "id": "shortlinerailroad",
            "position": 36,
            "price": 200,
            "group": "Railroad",
            "oprice": 200
        },
        {
            "name": "Go",
            "id": "go",
            "position": 0,
            "group": "Special"
        }
    ],
    "tiles": [
        {
            "id": "go"
        },
        {
            "id": "mediterraneanave"
        },
        {
            "id": "communitychest"
        },
        {
            "id": "balticave"
        },
        {
            "id": "incometax"
        },
        {
            "id": "readingrailroad"
        },
        {
            "id": "orientalave"
        },
        {
            "id": "chance"
        },
        {
            "id": "vermontave"
        },
        {
            "id": "connecticutave"
        },
        {
            "id": "jail"
        },
        {
            "id": "stcharlesplace"
        },
        {
            "id": "electriccompany"
        },
        {
            "id": "statesave"
        },
        {
            "id": "virginiaave"
        },
        {
            "id": "pennsylvaniarailroad"
        },
        {
            "id": "stjamesplace"
        },
        {
            "id": "communitychest"
        },
        {
            "id": "tennesseeave"
        },
        {
            "id": "newyorkave"
        },
        {
            "id": "freeparking"
        },
        {
            "id": "kentuckyave"
        },
        {
            "id": "chance"
        },
        {
            "id": "indianaave"
        },
        {
            "id": "illinoisave"
        },
        {
            "id": "borailroad"
        },
        {
            "id": "atlanticave"
        },
        {
            "id": "ventnorave"
        },
        {
            "id": "waterworks"
        },
        {
            "id": "marvingardens"
        },
        {
            "id": "gotojail"
        },
        {
            "id": "pacificave"
        },
        {
            "id": "northcarolinaave"
        },
        {
            "id": "communitychest"
        },
        {
            "id": "pennsylvaniaave"
        },
        {
            "id": "shortlinerailroad"
        },
        {
            "id": "chance"
        },
        {
            "id": "parkplace"
        },
        {
            "id": "luxerytax"
        },
        {
            "id": "boardwalk"
        }
    ],
    "chance": [
        {
            "title": "Advance to Go (Collect $200)",
            "action": "move",
            "tileid": "go"
        },
        {
            "title": "Advance to Illinois Avenue - If you pass Go, collect $200",
            "action": "move",
            "tileid": "illinoiseave"
        },
        {
            "title": "Advance to St. Charles Place - If you pass Go, collect $200",
            "action": "move",
            "tileid": "stcharlesplace"
        },
        {
            "title": "Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.",
            "action": "movenearest",
            "groupid": "utility",
            "rentmultiplier": 10
        },
        {
            "title": "Advance token to the nearest Railroad and pay owner twice the rental to which he/she is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.",
            "action": "movenearest",
            "groupid": "railroad",
            "rentmultiplier": 2
        },
        {
            "title": "Bank pays you dividend of $50",
            "action": "addfunds",
            "amount": 50
        },
        {
            "title": "Get out of Jail Free - This card may be kept until needed, or traded/sold",
            "action": "jail",
            "subaction": "getout"
        },
        {
            "title": "Go Back 3 Spaces",
            "action": "move",
            "count": -3
        },
        {
            "title": "Go to Jail - Go directly to Jail - Do not pass Go, do not collect $200",
            "action": "jail",
            "subaction": "goto"
        },
        {
            "title": "Make general repairs on all your property - For each house pay $25 - For each hotel $100",
            "action": "propertycharges",
            "buildings": 25,
            "hotels": 100
        },
        {
            "title": "Pay poor tax of $15",
            "action": "removefunds",
            "amount": 15
        },
        {
            "title": "Take a trip to Reading Railroad - If you pass Go, collect $200",
            "action": "move",
            "tileid": "readingrailroad"
        },
        {
            "title": "Take a walk on the Boardwalk - Advance token to Boardwalk",
            "action": "move",
            "tileid": "boardwalk"
        },
        {
            "title": "You have been elected Chairman of the Board - Pay each player $50",
            "action": "removefundstoplayers",
            "amount": 50
        },
        {
            "title": "Your building loan matures - Collect $150",
            "action": "addfunds",
            "amount": 50
        }
    ],
    "communitychest": [
        {
            "title": "Advance to Go (Collect $200)",
            "action": "move",
            "tileid": "go"
        },
        {
            "title": "Bank error in your favor - Collect $200 ",
            "action": "addfunds",
            "amount": 200
        },
        {
            "title": "Doctor fee - Pay $50",
            "action": "removefunds",
            "amount": 50
        },
        {
            "title": "From sale of stock you get $50",
            "action": "addfunds",
            "amount": 50
        },
        {
            "title": "Get Out of Jail Free",
            "action": "jail",
            "subaction": "getout"
        },
        {
            "title": "Go to Jail - Go directly to jail - Do not pass Go - Do not collect $200",
            "action": "jail",
            "subaction": "goto"
        },
        {
            "title": "Grand Opera Night - Collect $50 from every player for opening night seats",
            "action": "addfundsfromplayers",
            "amount": 50
        },
        {
            "title": "Holiday Fund matures - Receive $100",
            "action": "addfunds",
            "amount": 100
        },
        {
            "title": "Income tax refund - Collect $20",
            "action": "addfunds",
            "amount": 20
        },
        {
            "title": "Life insurance matures - Collect $100",
            "action": "addfunds",
            "amount": 100
        },
        {
            "title": "Pay hospital fees of $100",
            "action": "removefunds",
            "amount": 100
        },
        {
            "title": "Pay school fees of $150",
            "action": "removefunds",
            "amount": 150
        },
        {
            "title": "Receive $25 consultancy fee",
            "action": "addfunds",
            "amount": 25
        },
        {
            "title": "You are assessed for street repairs - $40 per house - $115 per hotel",
            "action": "propertycharges",
            "buildings": 40,
            "hotels": 115
        },
        {
            "title": "You have won second prize in a beauty contest - Collect $10",
            "action": "addfunds",
            "amount": 10
        },
        {
            "title": "You inherit $100",
            "action": "addfunds",
            "amount": 100
        }
    ],
    "attribution": "danielstern @ https://github.com/danielstern/science MIT ref bower.json"
}`;
/* tslint:enable */

import { IPropertyData } from './Entities/AsProperty';
export interface IDataSource {
    properties: Array<IPropertyData>;

    attribution: string;
}

/**
 * MutData returns a copy of the data suitable for mutation
 */
export function MutData(): IDataSource {
    return JSON.parse(raw) as IDataSource;
}

let parsed = MutData();

export default parsed;
