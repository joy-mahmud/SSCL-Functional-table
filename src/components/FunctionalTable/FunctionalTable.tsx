'use client'

import React, { useEffect, useRef, useState, ReactNode } from "react";
import { ChevronUp, ChevronDown, EyeOff, MoreVertical, AlignLeft, AlignRight, Columns3, ArrowUpWideNarrow, Eye, CircleCheck, Download, ChevronLeft, MoveLeft, MoveRight } from "lucide-react";
import Link from "next/link";
import Tooltip from "./Tooltip";


type Column = {
    accessorKey: string;
    label: string;
    Cell?: ({ cell }: { cell: any }) => ReactNode;
};

type Row = {
    [key: string]: string;
};

type filterType = {
    id: string,
    label: string,
    value: string
}
interface RightSideModalProps {
    isOpen: boolean;
    onClose: () => void;
    height?: string; // e.g. "h-[400px]"
    children: ReactNode;
}
interface SwitchProps {
    checked: boolean;
    disabled?: boolean;
}

const filterItems: filterType[] = [
    { id: 'all', label: 'All', value: 'all' },
    { id: 'pending', label: 'PENDING', value: 'Pending for Approval' },
    { id: 'returned', label: 'RETURNED', value: 'LC Returned' }
]


const columns: Column[] = [
    { accessorKey: "sl", label: "SL",Cell:({cell}:any)=>{
        return(
            <div>
                <h2>Hello</h2>
            </div>
        )
    } },
    { accessorKey: "actions", label: "Actions" },
    { accessorKey: "lc_number", label: "LC Number" },
    { accessorKey: "rpa_lc_number", label: "RPA LC Number" },
    { accessorKey: "lc_type", label: "LC Type" },
    { accessorKey: "lc_status", label: "LC Status" },
    { accessorKey: "creation_date_time", label: "Date & Time of Creation" },
    { accessorKey: "company", label: "Company Name" },
    { accessorKey: "lc_beneficiary", label: "LC Beneficiary" },
    { accessorKey: "currency", label: "Currency" },
    { accessorKey: "lc_amount", label: "LC Amount" },
    { accessorKey: "remarks", label: "Remarks" },
];

const data: Row[] = [
    { sl: "1", actions: "actions", lc_number: "155525040690", rpa_lc_number: "250325-001", lc_type: "12AC", lc_status: "Pending for Approval", creation_date_time: "25 MAR 2025 3:02:45 PM", company: "MNIT ASIA LIMITED", lc_beneficiary: "SPINNING MILLS LIMITED", currency: "USD", lc_amount: "45580.00", remarks: "" },
    { sl: "2", actions: "actions", lc_number: "255525040690", rpa_lc_number: "250325-001", lc_type: "12AC", lc_status: "LC Returned", creation_date_time: "25 MAR 2025 3:02:45 PM", company: "ASIA LIMITED", lc_beneficiary: "R.A. SPINNING MILLS LIMITED", currency: "USD", lc_amount: "45580.00", remarks: "" },
    { sl: "3", actions: "actions", lc_number: "255525040690", rpa_lc_number: "250325-001", lc_type: "12AC", lc_status: "LC Returned", creation_date_time: "25 MAR 2025 3:02:45 PM", company: "ASIA LIMITED", lc_beneficiary: "R.A. SPINNING MILLS LIMITED", currency: "USD", lc_amount: "45580.00", remarks: "" },
    { sl: "4", actions: "actions", lc_number: "255525040690", rpa_lc_number: "250325-001", lc_type: "12AC", lc_status: "LC Returned", creation_date_time: "25 MAR 2025 3:02:45 PM", company: "ASIA LIMITED", lc_beneficiary: "R.A. SPINNING MILLS LIMITED", currency: "USD", lc_amount: "45580.00", remarks: "" },
    { sl: "5", actions: "actions", lc_number: "255525040690", rpa_lc_number: "250325-001", lc_type: "12AC", lc_status: "LC Returned", creation_date_time: "25 MAR 2025 3:02:45 PM", company: "ASIA LIMITED", lc_beneficiary: "R.A. SPINNING MILLS LIMITED", currency: "USD", lc_amount: "45580.00", remarks: "" },
    { sl: "6", actions: "actions", lc_number: "255525040690", rpa_lc_number: "250325-001", lc_type: "12AC", lc_status: "LC Returned", creation_date_time: "25 MAR 2025 3:02:45 PM", company: "ASIA LIMITED", lc_beneficiary: "R.A. SPINNING MILLS LIMITED", currency: "USD", lc_amount: "45580.00", remarks: "" },
    { sl: "7", actions: "actions", lc_number: "155525040690", rpa_lc_number: "250325-001", lc_type: "12AC", lc_status: "LC Returned", creation_date_time: "25 MAR 2025 3:02:45 PM", company: "MNIT ASIA LIMITED", lc_beneficiary: "SPINNING MILLS LIMITED", currency: "USD", lc_amount: "45580.00", remarks: "" },
    { sl: "8", actions: "actions", lc_number: "155525040690", rpa_lc_number: "250325-001", lc_type: "12AC", lc_status: "LC Returned", creation_date_time: "25 MAR 2025 3:02:45 PM", company: "MNIT ASIA LIMITED", lc_beneficiary: "SPINNING MILLS LIMITED", currency: "USD", lc_amount: "45580.00", remarks: "" },

];

const FunctionalTable = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [enabledColumns, setEnabledColumns] = useState(columns.map((col)=>{
        return {...col,enabled:true}
    }));

    const [searchTerm, setSearchTerm] = useState("")
    const [activeFilterItem, setActiveFilterItem] = useState<string>("all")
    const [filterColumnName, setFilterColumnName] = useState<string>("Select a column name")
    const [selectedFilterColumn, setSelectedFilterColumn] = useState<string>("")
    // const [visibleColumns, setVisibleColumns] = useState<string[]>(
    //     columns.map((col) => col.id)
    // );
    const [visibleColumns, setVisibleColumns] = useState(columns);

    const [numberOfPending, setNumberOfPending] = useState<number | null>(null)
    const [numberOfReturned, setNumberOfReturned] = useState<number | null>(null)
    const [paginatedData, setPaginatedData] = useState<Row[] | null>(null)

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [openfilterByColumnDropdown, setopenfilterByColumnDropdown] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    // useEffect(() => {
    //     if (openDropdown) {
    //       document.body.style.overflow = 'hidden';
    //     } else {
    //       document.body.style.overflow = '';
    //     }

    //     // Clean up on unmount
    //     return () => {
    //       document.body.style.overflow = '';
    //     };
    //   }, [openDropdown]);
    useEffect(() => {

        if (searchTerm) {
            console.log(selectedFilterColumn)
            const searchData = data.filter(data => data[selectedFilterColumn]?.toLowerCase().includes(searchTerm?.toLowerCase()))
            setPaginatedData(searchData)

        } else {
            setPaginatedData(data)
        }
    }, [searchTerm])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null)
                setopenfilterByColumnDropdown(false)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    })

    useEffect(() => {
        const pending = data.filter(item => item.lc_status == "Pending for Approval")
        setNumberOfPending(pending.length)
        const returned = data.filter(item => item.lc_status == "LC Returned")
        setNumberOfReturned(returned.length)
    })
    useEffect(() => {
        // if (data && activeFilterItem=="all" && selectedFilterColumn=="") {
        //     setPaginatedData(dataSlicing(data))
        // }else if(activeFilterItem !="all"){
        //     if(paginatedData){
        //         setPaginatedData(dataSlicing(paginatedData))
        //     }   
        // }
        if (data) {
            setPaginatedData(dataSlicing(data))
        }


    }, [currentPage])

    const dataSlicing = (data: Row[]) => {
        return data?.slice(
            (currentPage - 1) * rowsPerPage,
            currentPage * rowsPerPage
        )
    }

    const handlePageChange = (value: number) => {
        if (value >= 1 && value <= totalPages) setCurrentPage(value);
    };

    const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>, colId: string) => {
        // const DROPDOWN_WIDTH = 250;
        // const rect = e.currentTarget.getBoundingClientRect();
        // const viewportWidth = window.innerWidth;
        // const spaceRight = viewportWidth - rect.left;
        // const enoughSpaceRight = spaceRight >= DROPDOWN_WIDTH;
        // console.log(rect,window.scrollX)
        // const left = enoughSpaceRight
        //   ? rect.left + window.scrollX
        //   : rect.right - DROPDOWN_WIDTH + window.scrollX;
        // setDropdownPosition({
        //   top: rect.bottom + window.scrollY,  // Add scroll to align properly
        //   left: left,
        // });
        const triggerRect = e.currentTarget.getBoundingClientRect();
        setOpenDropdown((prev) => {
            console.log(prev)
            return (prev === colId ? null : colId)
        });
        setTimeout(() => {
            if (dropdownRef.current) {
                const dropdownRect = dropdownRef.current.getBoundingClientRect();
                const dropdownWidth = dropdownRect.width;

                const viewportWidth = window.innerWidth;
                const enoughSpaceRight = viewportWidth - triggerRect.left >= dropdownWidth;

                const left = enoughSpaceRight
                    ? triggerRect.left + window.scrollX
                    : triggerRect.right - dropdownWidth + window.scrollX;

                const top = triggerRect.bottom + window.scrollY;

                setDropdownPosition({ top, left });
            }
        }, 0);
    };


    //console.log(visibleColumns)
    const handleFilterByStatus = (filter_item: string) => {
        setActiveFilterItem(filter_item)
        if (filter_item == "all") {
            setPaginatedData(dataSlicing(data))
        } else {
            const filterType = filterItems.find(val => val.id == filter_item)
            console.log(filterType)

            const filteredData: Row[] = data?.filter(item => item.lc_status === filterType?.value)
            console.log(filteredData)
            setPaginatedData(filteredData)


        }

    }
    const handleFilterByColumn = (column_name: string) => {
        console.log(column_name)
        if (column_name === "Select a column name") {
            setFilterColumnName("Select a column name")
        } else {
            const column = columns.find(val => val.accessorKey == column_name)
            console.log(column)
            column && setFilterColumnName(column?.label)
            column && setSelectedFilterColumn(column?.accessorKey)


        }
        setopenfilterByColumnDropdown(!openfilterByColumnDropdown)

    }
    const hideColumn = (accessorKey: string) => {
        setVisibleColumns((prev) => prev.filter((col) => col.accessorKey !== accessorKey));
        setOpenDropdown(null);
        setEnabledColumns((prev) => prev.map((col) => {
            if (col.accessorKey === accessorKey) {
                return { ...col, enabled: !col.enabled };
            }
            return col;
        }))
    };
    // const ToggleShowColumns = (colId: string) => {

    //     setEnabledColumns((prev) => prev.map((col) => {
    //         if (col.id == colId) {
    //             console.log(!col.enabled)
    //             return { id: col.id, label: col.label, enabled: !col.enabled }

    //         }
    //         else {
    //             return { id: col.id, label: col.label, enabled: col.enabled }
    //         }

    //     }))
    //     const visiblecol = enabledColumns.find((data)=>{
    //         if(data.id==colId){
    //              return data.id
    //         }
    //     })
    //     console.log(visiblecol)

    // }
    const ToggleShowColumns = (colId: string) => {
        setEnabledColumns((prev) => {
            const updated = prev.map((col) => {
                if (col.accessorKey === colId) {
                    return { ...col, enabled: !col.enabled };
                }
                return col;
            });

            const newVisibleColumns = updated
                .filter((col) => col.enabled)

            setVisibleColumns(newVisibleColumns);

            return updated;
        });
    };
    const showAllColumns = () => {
        setVisibleColumns(columns)
        setEnabledColumns(columns.map((col)=>{
            return {...col,enabled:true}
        }))
    }
    const hideAllColumns = () => {
        setVisibleColumns([])
        setEnabledColumns(columns.map((col)=>{
            return {...col,enabled:false}
        }))
    }
    const handleSort = (sortType: string) => {
        if (sortType == 'asc') {
            setPaginatedData(dataSlicing(data))
            setOpenDropdown(null);
        } else if (sortType == "desc") {
            setPaginatedData(data.reverse())
            setOpenDropdown(null);
        } else if (sortType == "clear") {
            setPaginatedData(dataSlicing(data))
            setOpenDropdown(null);
        }
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between border border-gray-300 p-5">
                <div>
                    <div className="flex gap-3 items-center my-5">
                        {
                            filterItems.map((item) => {
                                return (<div key={item.id} className="relative">
                                    <button onClick={() => handleFilterByStatus(item.id)} className={`hover:cursor-pointer px-5 py-1 rounded-md ${activeFilterItem == item.id ? 'bg-black text-white' : 'bg-gray-300 text-black'}`}>{item.label}</button>
                                    {item.id != "all" && <div className="absolute flex items-center justify-center text-white text-xs -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full">{item.id == "pending" ? numberOfPending : numberOfReturned}</div>}
                                </div>)
                            })
                        }
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-3 ">
                            <p>Filtered by:</p>
                            <div className="relative">
                                <div className="flex gap-3 items-center">
                                    <div onClick={() => handleFilterByColumn("Select a column name")} className="px-3 py-1 border border-gray-400 rounded-lg flex items-center hover:cursor-pointer">
                                        <p>{filterColumnName}</p>
                                        <ChevronDown size={20} />
                                    </div>
                                    {filterColumnName !== "Select a column name" && <input
                                        type="search"
                                        placeholder={`search ${filterColumnName.toLowerCase()}`}
                                        className="border border-gray-400 px-3 py-1 outline-none rounded-lg"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />}

                                </div>

                                {openfilterByColumnDropdown && <div ref={dropdownRef} className="absolute left-0 whitespace-nowrap bg-white border border-gray-200 shadow-md rounded-md z-10">
                                    <ul className="text-sm text-gray-700">
                                        {columns.map((col) => {
                                            if (col.accessorKey != "sl" && col.accessorKey != "actions") {
                                                return (
                                                    <li key={col.accessorKey}
                                                        onClick={() => handleFilterByColumn(col.accessorKey)}
                                                        className="px-3 py-1 hover:bg-gray-300 cursor-pointer flex items-center gap-2"
                                                    >
                                                        {col.label}
                                                    </li>
                                                )
                                            }

                                        }
                                        )}

                                    </ul>
                                </div>
                                }

                            </div>

                        </div>
                    </div>
                </div>
                <div className="mr-20">
                    <button className="flex items-center gap-4 bg-black rounded-lg text-white px-4 py-2"><Download size={16} color="#FFF" /> <span className="text-[14px]">Export</span></button>
                </div>
            </div>
            <div className=" pb-5 shadow-lg border border-t-0 border-gray-300">
                <div className=" flex p-5 pr-0 justify-end mr-10">
                    <button onClick={() => setModalOpen(true)} className="hover:cursor-pointer hover:bg-gray-200 w-[40px] h-[40px] flex items-center justify-center rounded-full"><Tooltip content="Show all columns"><Columns3></Columns3></Tooltip></button>
                    <RightSideModal isOpen={modalOpen} onClose={() => setModalOpen(false)} height="h-3/4">
                        <div className="flex justify-between items-center">
                            <button onClick={() => showAllColumns()} className="uppercase hover:cursor-pointer">Show all </button>
                            <div className="flex gap-3 items-center">
                                <button onClick={() => hideAllColumns()} className="uppercase hover:cursor-pointer">Hide all </button>
                                <button
                                    className="text-gray-950 hover:text-gray-900 bg-gray-200 hover:bg-gray-400 px-3 py-1 rounded-md hover:cursor-pointer"
                                    onClick={() => setModalOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <hr className="mt-2" />
                        <div className="mt-2">
                            {enabledColumns.map((col) => {
                                return (
                                    <div key={col.accessorKey} className="hover:bg-gray-200 px-2 py-2 mb-2 rounded-md">
                                        <div className="flex gap-3 items-center">
                                            <label onClick={() => ToggleShowColumns(col.accessorKey)} className="flex items-center gap-3">
                                                <Switch checked={col.enabled} />
                                            </label>
                                            <span>{col.label}</span>
                                        </div>
                                    </div>

                                )
                            })}


                        </div>
                    </RightSideModal>

                </div>
                <div className="overflow-x-auto">
                    <table className=" min-w-max w-full table-auto  ">
                        <thead className="bg-gray-100">
                        <tr>
  {visibleColumns.map((col) => (
    <th
      key={col.accessorKey}
      className="px-4 py-2 text-left border-b border-gray-300"
    >
      <div className="flex items-center gap-3 hover:cursor-pointer">
        {col.label}
        <div className="relative">
          <button
            className="p-1 rounded-full hover:bg-gray-200 w-[30px] h-[30px] hover:cursor-pointer"
            onClick={(e) => toggleDropdown(e, col.accessorKey)}
          >
            <MoreVertical size={20} />
          </button>

          {openDropdown === col.accessorKey && (
            <div
              ref={dropdownRef}
              className="fixed mt-2 whitespace-nowrap bg-white border border-gray-200 shadow-md rounded-md z-1000"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
              }}
            >
              <ul className="text-sm text-gray-700">
                <li
                  onClick={() => handleSort("clear")}
                  className="px-3 py-2 hover:bg-gray-300 cursor-pointer flex items-center gap-2"
                >
                  <ArrowUpWideNarrow size={20} />Clear sort
                </li>
                <li
                  onClick={() => handleSort("asc")}
                  className="px-3 py-2 hover:bg-gray-300 cursor-pointer flex items-center gap-2"
                >
                  <AlignLeft size={20} /> Sort By {col.label} Ascending
                </li>
                <li
                  onClick={() => handleSort("desc")}
                  className="px-3 py-2 hover:bg-gray-300 cursor-pointer flex items-center gap-2"
                >
                  <AlignRight size={20} /> Sort {col.label} Descending
                </li>
                <li
                  onClick={() => hideColumn(col.accessorKey)}
                  className="px-3 py-2 hover:bg-gray-300 cursor-pointer flex items-center gap-2"
                >
                  <EyeOff size={20} />Hide Column
                </li>
                <li
                  onClick={() => showAllColumns()}
                  className="px-3 py-2 hover:bg-gray-300 cursor-pointer flex items-center gap-2"
                >
                  <Columns3 size={20} />Show all columns
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </th>
  ))}
</tr>

                        </thead>
                        <tbody>
                            {paginatedData && paginatedData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-t border-gray-200">
                                    {visibleColumns.map((col) => (
                                        <td key={col.accessorKey} className="px-4 py-2">
                                            {col.accessorKey == "actions" ? <div className="flex gap-3 items-center">
                                                <Link href={'/details'}><Eye size={20} /></Link>
                                                <CircleCheck size={16} color="#008000" />
                                            </div> : row[col.accessorKey]}

                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Pagination Controls */}
            <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                {/* Rows per page */}
                <div className="flex items-center gap-2">
                    <label htmlFor="rows" className="text-sm text-gray-700">Rows per page:</label>
                    <select
                        id="rows"
                        className="border rounded px-2 py-1 text-sm"
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1); // reset to page 1
                        }}
                    >
                        {[5, 10, 15, 20].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Page control */}
                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50 flex gap-2 items-center hover:cursor-pointer"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <MoveLeft size={12} />  <span>Prev</span>
                    </button>
                    <span className="text-sm text-gray-600">Page: </span>
                    <input
                        type="number"
                        className="w-16 border rounded px-2 py-1 text-sm text-center"
                        defaultValue={1}
                        onChange={(e) => handlePageChange(Number(e.target.value))}
                        min={1}
                        max={totalPages}
                    />

                    <span className="text-sm text-gray-600"> of {totalPages}</span>

                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50 flex gap-2 items-center hover:cursor-pointer"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <span>Next</span>  <MoveRight size={12} />
                    </button>
                </div>
            </div>
        </div>

    );
}
const RightSideModal: React.FC<RightSideModalProps> = ({
    isOpen,
    onClose,
    children,
    height = "h-[500px]", // default height
}) => {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-transparent flex justify-end items-center">
            {/* Overlay click */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            />

            {/* Centered right-side modal */}
            <div
                className={`relative bg-white shadow-xl p-6 w-full max-w-[400px] rounded-md ${height} transition-transform duration-300 ease-in-out overflow-y-auto`}
            >

                {children}
            </div>
        </div>
    );
};
const Switch: React.FC<SwitchProps> = ({ checked, disabled = false }) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 
          border-transparent transition-colors duration-200 ease-in-out 
          focus:outline-none 
          ${checked ? "bg-gray-950" : "bg-gray-400"} 
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        >
            <span
                className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow 
            ring-0 transition duration-200 ease-in-out
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
            />
        </button>
    );
};

export default FunctionalTable