import React from 'react';
import { CSSProperties } from 'react';

interface Option {
  label: string;
  value: string;
}

interface DualColumnCheckboxModalProps {
  visible: boolean;
  title: string;
  leftTitle: string;
  rightTitle: string;
  leftOptions: Option[];
  rightOptions: Option[];
  selectedLeft: string[];
  selectedRight: string[];
  onChangeLeft: (values: string[]) => void;
  onChangeRight: (values: string[]) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const DualColumnCheckboxModal = ({
  visible,
  title,
  leftTitle,
  rightTitle,
  leftOptions,
  rightOptions,
  selectedLeft,
  selectedRight,
  onChangeLeft,
  onChangeRight,
  onClose,
  onConfirm,
}: DualColumnCheckboxModalProps) => {
  if (!visible) return null;

  const toggle = (
    value: string,
    selected: string[],
    setSelected: (v: string[]) => void
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const maxLength = Math.max(leftOptions.length, rightOptions.length);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <span style={styles.title}>{title}</span>
          <button onClick={onClose} style={styles.close}>×</button>
        </div>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>선택</th>
                <th style={styles.th}>{leftTitle}</th>
                <th style={styles.th}>선택</th>
                <th style={styles.th}>{rightTitle}</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxLength }).map((_, i) => {
                const left = leftOptions[i];
                const right = rightOptions[i];
                return (
                  <tr key={i}>
                    <td style={styles.td}>
                      {left && (
                        <input
                          type="checkbox"
                          checked={selectedLeft.includes(left.value)}
                          onChange={() =>
                            toggle(left.value, selectedLeft, onChangeLeft)
                          }
                        />
                      )}
                    </td>
                    <td style={styles.td}>{left?.label || ''}</td>
                    <td style={styles.td}>
                      {right && (
                        <input
                          type="checkbox"
                          checked={selectedRight.includes(right.value)}
                          onChange={() =>
                            toggle(right.value, selectedRight, onChangeRight)
                          }
                        />
                      )}
                    </td>
                    <td style={styles.td}>{right?.label || ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={styles.footer}>
          <button onClick={onConfirm} style={styles.confirm}>확인</button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    width: 800,
    maxHeight: '80vh',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 16,
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  close: {
    background: 'none',
    border: 'none',
    fontSize: 20,
    cursor: 'pointer',
  },
  tableContainer: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: 12,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    position: 'sticky',
    top: 0,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  th: {
    padding: '8px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    backgroundColor: '#f5f5f5',
  },
  td: {
    padding: '8px',
    borderBottom: '1px solid #ddd',
  },
  footer: {
    textAlign: 'right',
    marginTop: 'auto',
  },
  confirm: {
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 4,
    cursor: 'pointer',
  },
};

export default DualColumnCheckboxModal;
