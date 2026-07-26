export function DisclaimerFooter() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '16px 32px',
        marginTop: 'auto',
      }}
    >
      <p
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          fontSize: 12,
          lineHeight: 1.6,
          color: 'var(--text-faint)',
        }}
      >
        หมายเหตุ: ข้อมูลในเว็บไซต์นี้จัดทำขึ้นเพื่อการศึกษาเท่านั้น ไม่ถือเป็นคำแนะนำในการลงทุน
        ผู้ใช้ควรศึกษาข้อมูลเพิ่มเติมและปรึกษาผู้เชี่ยวชาญก่อนตัดสินใจลงทุน
      </p>
    </footer>
  );
}
