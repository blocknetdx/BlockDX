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
            <div className='flex-grow-1 table-container'>
                <table className={`full-width ${className}`}>
                    <thead className='h-24 table-header-bottom'>
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
                        {table.getRowModel().rows.map((row, index) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        <div className={index === 0 ? 'm-t-5' : ''}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </div>
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