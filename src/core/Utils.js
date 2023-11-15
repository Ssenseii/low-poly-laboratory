/// Applying a function on each element in the array except the null ones.

export function Iterate_Over(array, callback) {
    for (let [index , element] of array.entries()) {
        if (element !== null) {
            callback(index, element)
        }
    }
}
