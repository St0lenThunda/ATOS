let idCounter = 0;

function addIdToNestedObject ( obj ) {
  if ( typeof obj === 'object' && obj !== null ) {
    obj.id = idCounter++;
    for ( let key in obj ) {
      if ( Object.prototype.hasOwnProperty.call(obj,  key ) && typeof obj[key] === 'object' ) {
        addIdToNestedObject( obj[key] );
      }
    }
  }
}

// Example usage
let jsonObject = {
  "Purchases": {
    "House": {
      "icon": "house",
      "text": "Purchases related to the home",
      "Repairs": {
        "icon": "home_repair_service",
        "title": "Repairs & Maintenance",
        "text": "Purchases related to the home repairs or improvements",
        "children": [{
          "label": "Doors",
          "icon": "home_repair_service",
          "description": {
            "title": "Replace or repair",
            "para": [
              "Purchases door related hardware"
            ]
          }
        }]
      },
      "Individuals": {
        "icon": "groups",
        "title": "Individual Purchases",
        "text": "Lorem ipsum dolor sit, amet consectetur adipisicing minima assumenda consectetur culpa fuga nulla ullam.In, libero  elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi ",
        "children": [
          {
            "title": "Antonio",
            "icon": "person",
            "text": "Lorem ipsum dolor sit, amet consectetur adipisicing minima assumenda consectetur culpa fuga nulla ullam.In, libero elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi "
          },
          {
            "title": "Alexis",
            "icon": "person",
            "text": "Lorem ipsum dolor sit, amet consectetur adipisicing minima assumenda consectetur culpa fuga nulla ullam.In, libero elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi "
          }
        ]
      }
    }
  }
}

console.debug( 'Before:' + JSON.stringify( jsonObject, null, 2 ) );
addIdToNestedObject( jsonObject );
console.debug( 'After:' + JSON.stringify( jsonObject, null, 2 ) );
