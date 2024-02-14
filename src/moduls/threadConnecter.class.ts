export class ThreadConnector {
    public chNum: number;
    public coIndex: number;
    public thIndex: number;
    constructor(cN: number, ci: number, tI: number) {
        this.chNum = cN;
        this.coIndex = ci;
        this.thIndex = tI;
    }

    setValue(cN: number, ci: number, tI: number) {
        this.chNum = cN;
        this.coIndex = ci;
        this.thIndex = tI;
    }

    setValueIJ(ci: number, tI: number) {
        this.coIndex = ci;
        this.thIndex = tI;
    }


}
