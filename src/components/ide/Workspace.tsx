'use client';

import React from 'react';
import styles from '../../styles/ide/Workspace.module.css';

interface WorkspaceProps {
    leftPanel: React.ReactNode;
    rightPanel: React.ReactNode;
}

export default function Workspace({ leftPanel, rightPanel }: WorkspaceProps) {
    return (
        <div className={styles.workspace}>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, height: '100%' }}>
                {leftPanel}
            </div>

            <div className={styles.divider} />

            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, height: '100%' }}>
                {rightPanel}
            </div>
        </div>
    );
}
