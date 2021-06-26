
export async function searchDevice() {
    if(!navigator.bluetooth)
        throw new Error("Bluetooth is not supported by this browser");

    await navigator.bluetooth.requestDevice({ acceptAllDevices: true });

}