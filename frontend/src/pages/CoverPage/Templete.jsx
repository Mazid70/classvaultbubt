import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import bubtImg from '../../assets/bubt.png';

/* ─────────────────────────────────────────────
   DYNAMIC SIZING HELPERS
   Shrinks fonts / spacing when content is long
───────────────────────────────────────────── */
const getContentLength = data => {
  const fields = [
    data.assignment || '',
    data.experimentName || '',
    data.courseCode || '',
    data.courseTitle || '',
    data.name || '',
    data.id || '',
    data.teacher || '',
    data.department || '',
  ];
  return Math.max(...fields.map(f => f.length));
};

const scale = (base, maxLen) => {
  if (maxLen <= 30) return base;
  if (maxLen <= 50) return base * 0.9;
  if (maxLen <= 70) return base * 0.82;
  return base * 0.75;
};

/* ─────────────────────────────────────────────
   STYLES  (static values only; dynamic ones
   are injected inline per-render)
───────────────────────────────────────────── */
const styles = StyleSheet.create({
  page: {
    width: 794,
    height: 1123,
    padding: 25,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  container: {
    flex: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topBlock: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  assignmentBox: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 30,
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  infoSection: {
    paddingLeft: 40,
    flexDirection: 'column',
  },
  label: { fontWeight: 'bold' },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: '49%',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 20,
    padding: 12,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  boxTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    textDecoration: 'underline',
  },
  footer: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

const formatDate = dateStr => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const Templete = ({ data }) => {
  const maxLen = getContentLength(data);
  const s = base => scale(base, maxLen); // shorthand

  // Derived spacing — shrinks proportionally with text
  const gap = s(6);
  const logoH = s(120);
  const mb = s(10); // standard margin-bottom
  const mbSm = s(5); // small margin-bottom

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* ── University Header ── */}
          <View style={[styles.topBlock, { marginBottom: mbSm }]}>
            <Text
              style={{
                fontSize: s(19),
                fontWeight: 'extrabold',
                textAlign: 'center',
                marginBottom: mbSm,
              }}
            >
              Bangladesh University of Business and Technology
            </Text>
            <Text
              style={{
                fontSize: s(17),
                fontWeight: 'extrabold',
                textAlign: 'center',
                marginBottom: mb,
              }}
            >
              (BUBT)
            </Text>

            {/* Logo */}
            <View style={[styles.logoContainer, { marginBottom: mb }]}>
              <Image src={bubtImg} style={{ height: logoH }} />
            </View>

            {/* Type badge */}
            <View style={[styles.assignmentBox, { marginBottom: mb }]}>
              <Text style={{ fontSize: s(17), fontWeight: 'bold' }}>
                {data.type || 'ASSIGNMENT'}
              </Text>
            </View>
          </View>

          {/* ── Info Section ── */}
          <View style={[styles.infoSection, { marginBottom: mb }]}>
            {data.type?.toLowerCase() === 'assignment' && (
              <Text
                style={[
                  styles.infoText,
                  { fontSize: s(13), marginBottom: gap },
                ]}
              >
                <Text style={styles.label}>Assignment no: </Text>
                {data.assignment}
              </Text>
            )}

            <Text style={{ fontSize: s(13), marginBottom: gap }}>
              <Text style={styles.label}>Course Code: </Text>
              {data.courseCode}
            </Text>

            <Text style={{ fontSize: s(13), marginBottom: gap }}>
              <Text style={styles.label}>Course Title: </Text>
              {data.courseTitle}
            </Text>

            {data.type?.toLowerCase() === 'lab report' && (
              <>
                <Text style={{ fontSize: s(13), marginBottom: gap }}>
                  <Text style={styles.label}>Experiment no: </Text>
                  {data.experiment}
                </Text>
                <Text style={{ fontSize: s(13), marginBottom: gap }}>
                  <Text style={styles.label}>Experiment Name: </Text>
                  {data.experimentName}
                </Text>
              </>
            )}
          </View>

          {/* ── Submitted By / To ── */}
          <View style={[styles.section, { marginBottom: mb }]}>
            {/* Submitted By */}
            <View style={styles.box}>
              <Text
                style={[
                  styles.boxTitle,
                  { fontSize: s(13), marginBottom: gap },
                ]}
              >
                Submitted By
              </Text>
              {[
                ['Name', data.name],
                ['ID No', data.id],
                ['Intake', data.intake || '54'],
                ['Section', data.section || '01'],
                ['Program', 'B.Sc Engg in CSE'],
              ].map(([lbl, val]) => (
                <Text key={lbl} style={{ fontSize: s(12), marginBottom: gap }}>
                  <Text style={styles.label}>{lbl}: </Text>
                  {val}
                </Text>
              ))}
            </View>

            {/* Submitted To */}
            <View style={styles.box}>
              <Text
                style={[
                  styles.boxTitle,
                  { fontSize: s(13), marginBottom: gap },
                ]}
              >
                Submitted To
              </Text>
              {data.teacher && (
                <Text style={{ fontSize: s(12), marginBottom: gap }}>
                  <Text style={styles.label}>Name: </Text>
                  {data.teacher}
                </Text>
              )}
              {data.department && (
                <Text style={{ fontSize: s(12), marginBottom: gap }}>
                  <Text style={styles.label}>Department of: </Text>
                  {data.department}
                </Text>
              )}
              <Text style={{ fontSize: s(12) }}>
                Bangladesh University of Business &amp; Technology
              </Text>
            </View>
          </View>

          {/* ── Footer ── */}
          <Text style={[styles.footer, { fontSize: s(15) }]}>
            <Text style={styles.label}>Date of Submission: </Text>
            {formatDate(data.date)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default Templete;
