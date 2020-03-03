import { Url } from 'url';

export interface Datos {
    URL:Url;
    Imagen:Url;
    Nombre: string;
    Apellidos: string;
    Media: number;
    Posicion: string;
    Altura:string;
    FNac: Date;
    Foto:String;
    
    Velocidad: number;
    Regate: number;
    Tiro: number;
    Pase: number;
    Fisico: number;
    Defensa: number;

    PMala: number;
    Skills: number;
}