
/* BLE GATT UIDs */
const SERVICE_UID       = "199ecfda-a1f8-463f-89bb-7a698b36b2a1";
const TEMP_IN1          = "17ed73f7-f174-415f-89e2-154025a1b5da";
const TEMP_IN2          = "e743df97-33d9-40f2-a03d-273873dfcd7e";
const TEMP_OUT1         = "6eba5869-2dba-43ad-9fa5-bc60fab6abe9";
const TEMP_OUT2         = "ac255d90-c971-4d69-baa5-be6e6916d255";
const TEMP_TARGET       = "a630a2b6-398e-46ea-b4ce-d019b8afc2a5";
const VOLTAGE           =  "71442048-a860-49aa-b1c5-a163a3496fdd";
const BATTERY_STATUS    = "74ad860b-8e24-4e50-a352-116bb46fd172";
const COOLING_MODE      = "65ee7354-0f62-4c98-8673-18a3e932a886";

function toString(dataView: DataView) {
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(dataView.buffer);
}

function toFloat(dataView: DataView) {
    return dataView.getFloat32(0);
}

export interface CoolerData {
    tempIn1: number;
                tempIn2: number;
                tempOut1: number;
                tempOut2: number;
                tempTarget: number;
                voltage: number;
                batteryStatus: "test";
                coolingMode: "test";
}

export interface Cooler {
    getData(): Promise<CoolerData>;
}

export async function getCooler(): Promise<Cooler> {
    if(!navigator.bluetooth)
        throw new Error("Bluetooth wird vom Browser nicht unterstützt");

    const device = await navigator.bluetooth.requestDevice({ filters: [
        { services: [SERVICE_UID] }
    ]});

    const server = await device.gatt!.connect();
    const service = await server.getPrimaryService(SERVICE_UID);
    
    const characteristics = {
        tempIn1       : await service.getCharacteristic(TEMP_IN1),
        tempIn2       : await service.getCharacteristic(TEMP_IN2),
        tempOut1      : await service.getCharacteristic(TEMP_OUT1),
        tempOut2      : await service.getCharacteristic(TEMP_OUT2),
        tempTarget    : await service.getCharacteristic(TEMP_TARGET),
        voltage       : await service.getCharacteristic(VOLTAGE),
        batteryStatus : await service.getCharacteristic(BATTERY_STATUS),
        /* coolingMode   : await service.getCharacteristic(COOLING_MODE), */
    };

    return {
        async getData(): Promise<CoolerData> {
            const [tempIn1, tempIn2, tempOut1, tempOut2, tempTarget, voltage, batteryStatus /*, coolingMode */] = await Promise.all([
                characteristics.tempIn1.readValue(),
                characteristics.tempIn2.readValue(),
                characteristics.tempOut1.readValue(),
                characteristics.tempOut2.readValue(),
                characteristics.tempTarget.readValue(),
                characteristics.voltage.readValue(),
                characteristics.batteryStatus.readValue(),
                /* characteristics.coolingMode.readValue(), */
            ]);

            return {
                tempIn1: toFloat(tempIn1),
                tempIn2: toFloat(tempIn2),
                tempOut1: toFloat(tempOut1),
                tempOut2: toFloat(tempOut2),
                tempTarget: toFloat(tempTarget),
                voltage: toFloat(voltage),
                batteryStatus: toString(batteryStatus) as any,
                coolingMode: "test" /* toString(coolingMode) as any */
            };
        }
    };
}