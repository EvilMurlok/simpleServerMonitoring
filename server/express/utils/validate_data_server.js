const validate_data = (hostname, CPU_number) => {
    let messages = [];
    let [right_hostname, right_cpu_number] = [/^[a-zA-Z0-9_]{5,255}$/, /^[0-9]+$/];
    if ( !hostname ){
        messages.push(
            {
                type: 'error',
                text: "Поле наименования хоста обязательно для заполнения!"
            });

    }
    if ( !CPU_number ){
        messages.push(
            {
                type: 'error',
                text: "Поле количества ядер обязательно для заполнения!"
            });
    }
    if (hostname && !right_hostname.test(hostname)){
        messages.push(
            {
                type: 'error',
                text: "Наименование хоста должно состоять только из латинских букв и цифр, символов подчеркивания и иметь длину 5-255 символов!"
            });
    }
    if (CPU_number && !right_cpu_number.test(CPU_number)){
        messages.push(
            {
                type: 'error',
                text: "Количество ядер CPU - строго числовое поле!"
            });
    }
    if (CPU_number <= 0 || CPU_number > 150){
        messages.push(
            {
                type: 'error',
                text: "Количество ядер должно быть 1-150!"
            });
    }
    return messages;
}

module.exports = {validate_data};