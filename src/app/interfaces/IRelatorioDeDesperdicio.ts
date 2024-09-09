export interface IRelatorioDeDesperdicio {
    id: number;
    total_food_waste: number | string;
    waste_date: string;
    campus_id: number;
    created_at: string | null;
    updated_at: string | null;
    total_menu: number;
    total_distributed: number;
    reject_per_person: number;
    ingestion_percentage: number;
    classification: string;
    people_fed: number;
    menu: {
        id: number;
        date: string;
        description: string;
        campus_id: number;
        meal_id: number;
        meal: any;
    };
}