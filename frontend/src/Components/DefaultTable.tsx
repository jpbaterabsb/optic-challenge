import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import React from 'react';

type Props = {
    headers: Record<string, string>,
    defaultValue: Record<string, string>,
    values: any[],
    fieldKey: string,
    caption?: string,
};

export const DefaultTable: React.FC<Props> = ({ caption, headers, values, fieldKey, defaultValue}) => {
    return <TableContainer>
        <Table variant='simple'>
            {caption && <TableCaption>{caption}</TableCaption>}
            <Thead>
                <Tr>
                    {Object.values(headers).map(v => <Th key={v}>{v}</Th>)}
                </Tr>
            </Thead>
            <Tbody>
                {values.map(v =>
                    <Tr key={v[fieldKey]}>                    
                        {Object.keys(headers).map(h =>  <Td isTruncated maxWidth={'64'} key={h}>{v[h] || defaultValue[h]}</Td>)}
                    </Tr>
                )}
            </Tbody>
        </Table>
    </TableContainer>;
}