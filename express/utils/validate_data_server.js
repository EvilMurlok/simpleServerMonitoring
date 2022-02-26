const validate_data = (hostname, CPU_number) => {
    let messages = [];
    let [right_hostname, right_cpu_number] = [/^[a-zA-Z0-9_]{5,40}$/, /^[0-9]+/];
    if ( !hostname ){
        messages.push({ message: "Поле наименования хоста обязательно для заполнения!"});
    }
    if ( !CPU_number ){
        messages.push({ message: "Поле количества ядер обязательно для заполнения!"});
    }
    if (hostname && !right_hostname.test(hostname)){
        messages.push({ message: "Наименование хоста должно состоять только из латинских букв и цифр, символов подчеркивания и иметь длину 5-255 символов!" });
    }
    if (CPU_number && !right_cpu_number.test(CPU_number)){
        messages.push({ message: "Количество ядер CPU - строго числовое поле!"});
    }
    if (CPU_number <= 0 || CPU_number > 150){
        messages.push({ message: "Количество ядер должно быть 1-150!"});
    }
    return messages;
}

module.exports = {validate_data};