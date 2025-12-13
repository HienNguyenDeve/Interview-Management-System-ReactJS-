import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useField } from "formik";
import React, { useEffect, useId, useRef, useState } from "react";

export interface Option<T = string | boolean> {
    label: string;
    value: T;
}

interface SelectProps<T = string> {
    name: string;
    options: Option<T>[];
    multiple?: boolean;
    onChange?: (value: T | T[]) => void;
    click?: () => T | T[] | void;
    clickLabel?: string;
    clickIcon?: IconDefinition;
    id?: string;
    isShowError?: boolean;
}

const Select = <T,>(props: SelectProps<T>) => {
    const { name, options, multiple, onChange, click, clickLabel, clickIcon, id, isShowError } = props;
    const [field, meta, helpers] = useField(name);
    const { setValue } = helpers;
    const [search, setSearch] = useState<string>('');
    const [filteredOptions, setFilteredOptions] = useState<Option<T>[]>(options);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedOptions, setSelectedOptions] = useState<Option<T>[]>([]);
    const selectRef = useRef<HTMLDivElement>(null);
    const generatedId = useId();
    const inputId = id ?? `select-${generatedId}`;

    // Add state for tracking the focused option index
    const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        setFilteredOptions(
            options.filter(option => option.label.toLowerCase().includes(value.toLowerCase()))
        );
        setIsOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                setIsOpen(true);
                setFocusedOptionIndex(0);
                e.preventDefault();
            }
            return;
        }
        switch (e.key) {
            case 'ArrowDown':
                setFocusedOptionIndex(prev =>
                    prev < filteredOptions.length - 1 ? prev + 1 : prev
                );
                e.preventDefault();
                break;
            case 'ArrowUp':
                setFocusedOptionIndex(prev => (prev > 0 ? prev - 1 : prev));
                e.preventDefault()
                break;
            case 'Enter':
                if (focusedOptionIndex >= 0 && focusedOptionIndex < filteredOptions.length) {
                    handleSelect(filteredOptions[focusedOptionIndex]);
                }
                e.preventDefault();
                break;
            case 'Escape':
                setIsOpen(false);
                e.preventDefault();
                break;
            default:
                break;
        }
    };

    const handleSelect = (option: Option<T>) => {
        if (multiple) {
            const isAlreadySelected = selectedOptions.some(
                selected => selected.value === option.value
            );
            let newSelectedOptions: Option<T>[];
            if (isAlreadySelected) {
                newSelectedOptions = selectedOptions.filter(
                    selected => selected.value !== option.value
                );
            } else {
                newSelectedOptions = [...selectedOptions, option];
            }
            setSelectedOptions(newSelectedOptions);
            setValue(newSelectedOptions.map(opt => opt.value));
            if (onChange) {
                onChange(newSelectedOptions.map(opt => opt.value));
            }
        } else {
            setSelectedOptions([option]);
            setValue(option.value);
            setSearch(String(option.label));
            setIsOpen(false);
            if (onChange) {
                onChange(option.value);
            }
        }
    };

    const handleRemove = (optionValue: T) => {
        if (multiple) {
            const newSelectedOptions = selectedOptions.filter(
                option => option.value !== optionValue
            );
            setSelectedOptions(newSelectedOptions);
            setValue(newSelectedOptions.map(opt => opt.value));
            if (onChange) {
                onChange(newSelectedOptions.map(opt => opt.value));
            }
        } else {
            setSelectedOptions([]);
            setValue(null);
            setSearch('');
            setFilteredOptions(options);
            if (onChange) {
                onChange(null as unknown as T);
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setFilteredOptions(options);
    }, [options]);

    // Intialize selectedOptions based on Fomik's field.value
    useEffect(() => {
        if (multiple && Array.isArray(field.value)) {
            const selected = options.filter(option => field.value.includes(option.value));
            setSelectedOptions(selected);
        } else if (!multiple && field.value !== null && field.value !== undefined) {
            const selected = options.find(option => option.value === field.value);
            if (selected) {
                setSelectedOptions([selected]);
                setSearch(String(selected.label));
            } else {
                setSelectedOptions([]);
                setSearch('');
            }
        } else {
            setSelectedOptions([]);
            setSearch('');
        }
    }, [field.value, options, multiple]);

    const handleClick = () => {
        const newValue = click?.() as T;
        if (newValue !== undefined && newValue !== null) {
            if (multiple && Array.isArray(newValue)) {
                const newSelected = options.filter(o => newValue.includes(o.value));
                setSelectedOptions(newSelected);
                setValue(newValue);
            } else {
                const selectedOption = options.find(o => o.value === newValue);
                if (selectedOption) {
                    setSelectedOptions([selectedOption]);
                    setValue(selectedOption.value);
                    setSearch(selectedOption.label);
                }
            }
            setIsOpen(false);
        }
    };

    return (
        <div className="relative w-full bg-white flex justify-between items-center" ref={selectRef}>
            <div className={`relative flex flex-wrap flex-grow items-center pl-1 space-x-1 border border-slate-300 
               focus-within:border-blue-500 ${click ? 'rounded-l-sm' : 'rounded-sm'}`}
                 onClick={() => document.getElementById(inputId)?.focus()} aria-hidden="true"
            >
                {multiple && selectedOptions.map(option => (
                    <span key={String(option.value)} className="flex items-center bg-blue-100
                        text-slate-500 hover:text-blue-500 px-2 py-1 rounded-sm"
                    >
                        {option.label}
                        <button type="button" title="Remove option"
                            onClick={(e) => { e.stopPropagation(); handleRemove(option.value); }}
                            className="ml-2 text-red-500 focus:outline-none"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-md" />
                        </button>
                    </span>
                ))}
                <input type="text" id={inputId} value={search} 
                    onChange={handleSearchChange}
                    onClick={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 outline-none p-2 m-0 rounded-sm"
                    placeholder={multiple ? "Select options" : "Select an option"}
                    role="combobox"
                    aria-controls={`${inputId}-listbox`}
                    aria-expanded={isOpen ? 'true' : 'false'}
                />

                {isOpen && (
                    <div className="options absolute top-full bg-white border border-slate-300
                         w-full mt-1 max-h-60 overflow-auto z-10"
                         id={`${inputId}-listbox`} title="Options" aria-hidden='true'
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <div key={String(option.value)} onClick={() => handleSelect(option)}
                                     className={`p-2 hover:bg-slate-100 cursor-pointer ${multiple &&
                                        selectedOptions.some(sel => sel.value === option.value) ? 'bg-gray-200' : ''
                                        } ${index === focusedOptionIndex ? 'bg-blue-200' : ''}`} // Highlight focused option
                                    aria-hidden='true'
                                >
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-gray-500">No options found</div>
                        )}
                    </div>
                )}
                <FontAwesomeIcon icon={faAngleDown} className={`text-xl absolute right-2 top-3 text-gray-400
                    pointer-events-none ${isOpen ? 'transform rotate-180' : ''}`}></FontAwesomeIcon>
                {!multiple && field.value && (
                    <button type="button" title="Remove option"
                            onClick={() => handleRemove(field.value)}
                            className="text-xl absolute right-8 top-2 text-red-500"
                    >
                        <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                    </button>
                )}
            </div>

            {click && (
                <div className="actions h-[40px]">
                    <button
                        type="button"
                        title={clickLabel}
                        onClick={handleClick}
                        className="bg-blue-500 block px-2 h-full min-w-10 text-white
                            hover:bg-blue-700 focus:outline-none"
                    >
                        {clickIcon && <FontAwesomeIcon icon={clickIcon} className="mr-2" />}
                        {clickLabel && <span>{clickLabel}</span>}
                    </button>
                </div>
            )}
            {isShowError && meta.touched && meta.error ?
                (<div className="text-red-500 text-sm mt-1">{meta.error}</div>) : null}
        </div>
    );
};

export default Select;