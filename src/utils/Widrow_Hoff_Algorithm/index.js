`use strict`;

const Widrow_Hoff_Algorithm = ({
    data_to_calculate,
    weights,
    learning_rate,
    epochs,
    set_data_training,
    bias
}) => {
    const data_training = [];
    let weights_to_train = [...weights, bias.W0];

    for (let epoch = 0; epoch < epochs; epoch++) {
        
        const calculated_data_epoch = [];

        for (let data of data_to_calculate) {
            const { 
                Expected,
                ...inputs_data_to_train
            } = data;
            
            const array_data_to_train = [...Object.values(inputs_data_to_train), bias.X0];

            const Sum_of_all_inputs_with_weights = array_data_to_train.reduce((sum, input, index) => {
                return sum + (input * weights_to_train[index]);
            }, 0);

            const all_sums_elevated_to_2 = array_data_to_train.reduce((sum, input) => sum + Math.pow(input, 2), 0);

            const middleman_output = Sum_of_all_inputs_with_weights;
            const output = middleman_output >= 0 ? 1 : -1;
            const output_is_correct = Expected === output;
            const error = Expected - middleman_output;

            const new_weights = array_data_to_train.map((input, index) => {
                return Number(weights_to_train[index]) + (learning_rate * error * (input/all_sums_elevated_to_2));
            });

            calculated_data_epoch.push({
                array_data_to_train,
                Sum_of_all_inputs_with_weights,
                all_sums_elevated_to_2,
                middleman_output,
                output,
                output_is_correct,
                error,
                new_weights,
                old_weights: weights_to_train,
                expected: Expected,
                learning_rate
            });

            if(output_is_correct === false) {
                weights_to_train = new_weights;
            };
        }

        data_training.push(calculated_data_epoch);

        const epoch_is_correct = calculated_data_epoch.every(data => data.output_is_correct);

        if(epoch_is_correct) {
            break
        };
    }

    set_data_training(data_training);
}

module.exports = {
    Widrow_Hoff_Algorithm
}