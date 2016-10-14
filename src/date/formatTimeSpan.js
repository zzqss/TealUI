
/**
 * ��ʽ��һ��ʱ��Ρ�
 * @param ms �ܺ���������������벿����ɵ����顣
 * @return ���ظ�ʽ������ַ�����
 * @example formatTimeSpan(50) // "0.05ms"
 * @example formatTimeSpan(6000) // "6s"
 * @example formatTimeSpan([1, 20000000]) // "1.02s"
 */
export function formatTimeSpan(ms: number | number[] | [number, number]) {
    let unit: string;

    if (typeof ms === "number") {
        if (ms < 0.01) return `<0.01ms`;
        if (ms < 1000) { unit = "ms"; }
        else if (ms < 60000) { ms = ms / 1000; unit = "s"; }
        else { ms = ms / 60000; unit = "min"; }
    } else {
        const s = ms[0];
        const ns = ms[1];
        if (s < 1) {
            if (ns < 10000) return "<0.01ms";
            ms = ns / 1000000;
            unit = "ms";
        } else {
            ms = s + ns / 1000000000;
            if (s < 60) { unit = "s"; }
            else { ms = ms / 60; unit = "min"; }
        }
    }

    return ms.toFixed(2).replace(/(\.00|0)?$/, unit);
}
