"use client";
import { useState, useEffect, Dispatch, SetStateAction, } from "react";
import { useQuery } from "react-query";
import { getAllClubs } from "@/hooks/club";
import APIImageComponent from "@/hooks/imageAPI";
import AddClubForm from "../../../components/manageclubs/AddClubForm";
import DashboardContainer from "@/components/common/dashboardContainer/DashboardContainer";
import RatingStars from "@/components/common/ratingStars/RatingStars";
import DeleteWarning from "@/components/manageclubs/DeleteWarning";
import { MdEdit, MdDelete } from "react-icons/md";

export default function ManageClubs () {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [deleteWarning, setDeleteWarning] = useState<boolean>(false);
    const [tempId, setTempId] = useState<number>(-1);

    const {
        data: clubsData,
        isLoading: clubsLoading,
        isError: clubsError,
        refetch: refetchClubs
    } = useQuery("clubs", getAllClubs)

    useEffect(() => {
        if (!isOpen && !deleteWarning) {
            refetchClubs();
        }
    }, [isOpen, tempId]);

    return (
        <div className="flex flex-col items-center bg-mainWhite min-h-max p-8 space-y-6">
            {!isOpen ? (
                <>
                    <button onClick={() => (setIsOpen(true))} className="bg-mainGreen text-mainWhite text-xl w-fit px-4 py-2 rounded">Dodaj klub</button>
                    { clubsLoading || clubsError ? (
                        <div>
                            Trwa ładowanie danych...
                        </div>
                    ) : (
                        <div className="w-11/12 lg:w-3/5 space-y-2">
                            { clubsData && clubsData.content.map((club, index) => (
                                <DashboardContainer key={index} onClick={() => window.location.replace(`/managecourts/${club.id}`)} className="flex h-fit cursor-pointer">
                                    <div className="p-4 w-[20%]">
                                        <APIImageComponent imageId={club.logo.id} type={club.logo.path} />
                                    </div>
                                    <div className="flex flex-col justify-center w-full p-4 ">
                                        <p className="text-base">{ club.name }</p>
                                        <p className="text-xs font-sans mb-2">{ club.description }</p>
                                        <p className="text-sm text-mainOrange">{ club.location.name }</p>
                                        <span className="flex items-center space-x-8 mt-2 text-xs"> 
                                            <p>Liczba kortów: { club.courtsAmount }</p>
                                            <span className="flex items-center space-x-1"><p>Ocena:</p><RatingStars rating={club.rating}/></span>
                                        </span>
                                    </div>
                                    <span className="flex justify-end items-center text-2xl space-x-2 p-4">
                                        <MdEdit className="cursor-pointer hover:text-mainGreen"/>
                                        <MdDelete onClick={(e: any) => { e.stopPropagation(); setDeleteWarning(true); setTempId(club.id) }} className="cursor-pointer hover:text-red-600" /> 
                                    </span>
                                </DashboardContainer>
                            )) }
                        </div>
                    )}
                    { deleteWarning && (
                        <DeleteWarning deleteWarning={deleteWarning} setDeleteWarning={setDeleteWarning} tempId={tempId} setTempId={setTempId}/>
                    )}
                </>
            ) : (
                <AddClubForm isOpen={isOpen} setIsOpen={setIsOpen}/>
            )}

        </div>
    )
}