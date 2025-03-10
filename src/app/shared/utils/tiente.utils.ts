export function toVietnameseWords(number: number): string {
    if (isNaN(number)) return "Không phải số hợp lệ";
    
    const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    const tens = ["lẻ", "mười", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
    const scales = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

    let result = "";
    let numberStr = number?.toString();
    let groups = [];

    // Chia số thành từng nhóm ba chữ số
    while (numberStr?.length > 0) {
        groups.unshift(numberStr.slice(-3));
        numberStr = numberStr.slice(0, -3);
    }

    // Xử lý từng nhóm ba chữ số
    for (let i = 0; i < groups.length; i++) {
        let group = parseInt(groups[i]);

        if (group === 0) continue;

        let [hundreds, tensDigit, unitsDigit] = groups[i].padStart(3, "0").split("").map(Number);

        let groupText = "";

        if (hundreds) {
            groupText += units[hundreds] + " trăm ";
        }

        if (tensDigit > 1) {
            groupText += tens[tensDigit] + " ";
            if (unitsDigit !== 0) {
                groupText += (unitsDigit === 5 ? "lăm" : units[unitsDigit]) + " ";
            }
        } else if (tensDigit === 1) {
            groupText += "mười ";
            if (unitsDigit !== 0) {
                groupText += (unitsDigit === 5 ? "lăm" : units[unitsDigit]) + " ";
            }
        } else if (unitsDigit !== 0) {
            groupText += (hundreds ? "lẻ " : "") + (unitsDigit === 5 ? "năm" : units[unitsDigit]) + " ";
        }

        result += groupText + scales[groups.length - 1 - i] + " ";
    }

    return result.trim() + " Đồng";
}