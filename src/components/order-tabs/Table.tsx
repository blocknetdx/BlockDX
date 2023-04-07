import React, { useState } from 'react';
import {
    useReactTable, getCoreRowModel,
    flexRender,
    SortingState,
    getSortedRowModel
} from '@tanstack/react-table';

import './Table.css';

export const Table = ({columns = [], data = [], className = '', containerClass = ''}: any) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true
    })
    return (
        <div className={containerClass}>
            <div className='vertical-common-separator' />
            <div className='p-h-20 flex-grow-1 table-container'>
                <table className={`full-width ${className}`}>
                    <thead className='h-24'>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            :
                                            <div
                                                {...{
                                                    onClick: header.column.getToggleSortingHandler()
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {{
                                                    asc: null,
                                                    desc: null,
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </div> 
                                        }
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export const MemoTable = React.memo(Table) 