const DEFAULT_MINIMUM = 0;
const DEFAULT_MAXIMUM = 10000000;

class RandomGenerator {
    public static generate(minimum = DEFAULT_MINIMUM, maximum = DEFAULT_MAXIMUM) {
        let randomNumber =
            Math.floor(Math.random() *
                (maximum - minimum) + minimum);

        return randomNumber;
    }
}

export {
    RandomGenerator
};
