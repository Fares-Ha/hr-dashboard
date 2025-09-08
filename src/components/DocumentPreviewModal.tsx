import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DocumentPreviewModalProps {
    open: boolean;
    onClose: () => void;
    imagePath: string;
    title: string;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '1000px',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 2,
};

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
    open,
    onClose,
    imagePath,
    title,
}) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Box sx={{ position: 'relative' }}>
                    <IconButton
                        onClick={onClose}
                        sx={{ position: 'absolute', right: -8, top: -8, bgcolor: 'background.paper' }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <img
                        src={imagePath}
                        alt={title}
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: 'calc(90vh - 32px)',
                            objectFit: 'contain',
                        }}
                    />
                </Box>
            </Box>
        </Modal>
    );
};
