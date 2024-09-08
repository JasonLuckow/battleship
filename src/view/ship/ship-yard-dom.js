export { ShipYardDom };
    import { Ship } from "../../model/ship/Ship";
import { ShipDirection } from "../../model/ship/ship-direction";

class ShipYardDom {

    constructor(params) {
        var shipYard = document.createElement('div')
        shipYard.classList = 'ship-yard';

        return shipYard;
    }

}