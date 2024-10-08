export type Credit = {
    adult:                boolean;
    gender:               number;
    id:                   number;
    known_for_department: string;
    name:                 string;
    original_name:        string;
    popularity:           number;
    profile_path:         string;
    cast_id:              number;
    character:            string;
    credit_id:            string;
    order:                number;
}
export type TvCast = {
    adult:                boolean;
    gender:               number;
    id:                   number;
    known_for_department: string;
    name:                 string;
    original_name:        string;
    popularity:           number;
    profile_path:         string;
    character:            string;
    credit_id:            string;
    order:                number;
}

export type TvCrew = {
    adult:                boolean;
    gender:               number;
    id:                   number;
    known_for_department: string;
    name:                 string;
    original_name:        string;
    popularity:           number;
    profile_path:         null;
    credit_id:            string;
    department:           string;
    job:                  string;
}



export type Person = {
    adult:                boolean;
    gender:               number;
    id:                   number;
    known_for_department: string;
    name:                 string;
    original_name:        string;
    popularity:           number;
    profile_path:         string;
    known_for:            KnownFor[];
}

export type KnownFor = {
    backdrop_path:     null | string;
    id:                number;
    title:             string;
    original_title:    string;
    overview:          string;
    poster_path:       string;
    media_type:        string;
    adult:             boolean;
    original_language: string;
    genre_ids:         number[];
    popularity:        number;
    release_date:      Date;
    video:             boolean;
    vote_average:      number;
    vote_count:        number;
}

export type DetailPerson = {
    adult:                boolean;
    also_known_as:        string[];
    biography:            string;
    birthday:             Date;
    deathday:             null;
    gender:               number;
    homepage:             null;
    id:                   number;
    imdb_id:              string;
    known_for_department: string;
    name:                 string;
    place_of_birth:       string;
    popularity:           number;
    profile_path:         string;
}
