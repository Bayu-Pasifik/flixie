export type DetailTv = {
    adult:                boolean;
    backdrop_path:        string;
    created_by:           Created_by[];
    episode_run_time:     number[];
    first_air_date:       Date;
    genres:               Genre[];
    homepage:             string;
    id:                   number;
    in_production:        boolean;
    languages:            string[];
    last_air_date:        Date;
    last_episode_to_air:  LastEpisodeToAir;
    name:                 string;
    next_episode_to_air:  null;
    networks:             Network[];
    number_of_episodes:   number;
    number_of_seasons:    number;
    origin_country:       OriginCountry[];
    original_language:    string;
    original_name:        string;
    overview:             string;
    popularity:           number;
    poster_path:          string;
    production_companies: Network[];
    production_countries: ProductionCountry[];
    seasons:              Season[];
    spoken_languages:     SpokenLanguage[];
    status:               string;
    tagline:              string;
    type:                 string;
    vote_average:         number;
    vote_count:           number;
}

export type Genre = {
    id:   number;
    name: string;
}

export type LastEpisodeToAir = {
    id:              number;
    name:            string;
    overview:        string;
    vote_average:    number;
    vote_count:      number;
    air_date:        Date;
    episode_number:  number;
    episode_type:    string;
    production_code: string;
    runtime:         number;
    season_number:   number;
    show_id:         number;
    still_path:      string;
}

export type Network = {
    id:             number;
    logo_path:      string;
    name:           string;
    origin_country: OriginCountry;
}

export enum OriginCountry {
    Jp = "JP",
}

export type ProductionCountry = {
    iso_3166_1: OriginCountry;
    name:       string;
}

export type Season = {
    air_date:      Date;
    episode_count: number;
    id:            number;
    name:          string;
    overview:      string;
    poster_path:   string;
    season_number: number;
    vote_average:  number;
}

export type SpokenLanguage = {
    english_name: string;
    iso_639_1:    string;
    name:         string;
}

export type Created_by = {
    id:             number;
    credit_id:      string;
    name:           string;
    gender:         number;
    original_name:  string;
    profile_path:   string;
}