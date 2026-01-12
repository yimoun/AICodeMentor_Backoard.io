
import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import {
  InlineCodeBlock,
  CodeBlockHeader,
  CodeBlockContent,
} from '../../../styles/chat/ChatMessagesStyles';

interface CodeBlockProps {
  /** Code à afficher */
  code: string;
  /** Langage du code (pour le header) */
  language?: string;
  /** Afficher le bouton de copie */
  showCopy?: boolean;
}

/**
 * Bloc de code avec header et bouton de copie
 */
const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'Code',
  showCopy = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <InlineCodeBlock>
      <CodeBlockHeader>
        <span>{language}</span>
        {showCopy && (
          <Tooltip title={copied ? 'Copié !' : 'Copier le code'}>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{ 
                color: 'grey.400', 
                padding: 0.5,
                '&:hover': { color: 'grey.200' },
              }}
            >
              {copied ? (
                <CheckIcon sx={{ fontSize: 16 }} />
              ) : (
                <ContentCopyIcon sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Tooltip>
        )}
      </CodeBlockHeader>
      <CodeBlockContent>
        <code>{code}</code>
      </CodeBlockContent>
    </InlineCodeBlock>
  );
};

export default CodeBlock;