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
        <table style={styles.table}>
          <thead>
            <tr>
              <th>선택</th>
              <th>{leftTitle}</th>
              <th>선택</th>
              <th>{rightTitle}</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxLength }).map((_, i) => {
              const left = leftOptions[i];
              const right = rightOptions[i];
              return (
                <tr key={i}>
                  <td>
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
                  <td>{left?.label || ''}</td>
                  <td>
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
                  <td>{right?.label || ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
    width: 500,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 16,
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
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
  table: {
    width: '100%',
    marginBottom: 12,
  },
  footer: {
    textAlign: 'right',
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
