
const SERVICE_UID = "199ecfda-a1f8-463f-89bb-7a698b36b2a1";
const CHARACTERISTIC_UID = "17ed73f7-f174-415f-89e2-154025a1b5da";

export async function getCooler() {
    if(!navigator.bluetooth)
        throw new Error("Bluetooth is not supported by this browser");

    const device = await navigator.bluetooth.requestDevice({ filters: [
        { services: [SERVICE_UID] }
    ]});

    const server = await device.gatt!.connect();
    const service = await server.getPrimaryService(SERVICE_UID);
    const characteristic = await service.getCharacteristic(CHARACTERISTIC_UID);

    return {
        getCharacteristic() {
            return characteristic.readValue();
        },
    };
}