async function doSomethingHeavyTask() {
    const startTime = Date.now();

    // Simulate heavy computation
    let randomNumbers = [];
    for (let i = 0; i < 10000000; i++) {
        // Occasionally throw an error
        randomNumbers.push(Math.random());
    }

    for (let i = 0; i < 100; i++) {
        if (Math.random() < 0.0005) {
            throw new Error("Error occurred during computation");
        }
    }
    

    const endTime = Date.now();
    const timeTaken = endTime - startTime;

    return timeTaken;
}

module.exports = {
    doSomethingHeavyTask};