import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class Valid {
    /**
     * Validate độ dài tối thiểu
     * @param minLength Số ký tự tối thiểu
     */
    static minLength(minLength: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;
            return control.value.length >= minLength ? null : { minLength: { requiredLength: minLength } };
        };
    }

    /**
     * Validate độ dài tối đa
     * @param maxLength Số ký tự tối đa
     */
    static maxLength(maxLength: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;
            return control.value.length <= maxLength ? null : { maxLength: { requiredLength: maxLength } };
        };
    }

    /**
     * Validate giá trị tối thiểu
     * @param minValue Giá trị tối thiểu
     */
    static minValue(minValue: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;
            return control.value >= minValue ? null : { minValue: { requiredMin: minValue } };
        };
    }

    /**
     * Validate giá trị tối đa
     * @param maxValue Giá trị tối đa
     */
    static maxValue(maxValue: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;
            return control.value <= maxValue ? null : { maxValue: { requiredMax: maxValue } };
        };
    }

    /**
     * Kiểm tra số nguyên dương
     */
    static positiveInteger(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;
            const isValid = /^[1-9]\d*$/.test(control.value);
            return isValid ? null : { positiveInteger: true };
        };
    }

    /**
     * Kiểm tra định dạng regex động
     * @param pattern Biểu thức chính quy
     * @param errorKey Key lỗi trả về
     */
    static pattern(pattern: RegExp, errorKey: string = 'invalidPattern'): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;
            return pattern.test(control.value) ? null : { [errorKey]: true };
        };
    }

    /**
     * Kiểm tra giá trị có trong danh sách
     * @param allowedValues Danh sách giá trị hợp lệ
     */
    static inList(allowedValues: any[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;
            return allowedValues.includes(control.value) ? null : { notInList: true };
        };
    }

    /**
     * Kiểm tra hai trường có giống nhau không (ví dụ: xác nhận mật khẩu)
     * @param matchTo Tên trường cần so sánh
     */
    static matchValues(matchTo: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: true };
        };
    }

    /**
     * Kiểm tra giá trị rỗng hoặc null
     * @param value Giá trị cần kiểm tra
     */
    static isEmptyOrNull(value: any): boolean {
        return value === null || value === undefined || value === '';
    }

    /**
     * Kiểm tra mật khẩu trùng nhau
     * @param passwordControlName Tên trường mật khẩu
     * @param confirmPasswordControlName Tên trường xác nhận mật khẩu
     */
    static passwordMatch(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const password = control.get(passwordControlName)?.value;
            const confirmPassword = control.get(confirmPasswordControlName)?.value;
            return password === confirmPassword ? null : { passwordMismatch: true };
        };
    }
}
