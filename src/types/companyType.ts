export type Company = {
    id:             number;
    logo_path:      string;
    name:           string;
    origin_country: string;
}

export type DetailCompany = {
    description:    string;
    headquarters:   string;
    homepage:       string;
    id:             number;
    logo_path:      string;
    name:           string;
    origin_country: string;
    parent_company: ParentCompany;
}

export type ParentCompany = {
    name:      string;
    id:        number;
    logo_path: string;
}

export type Networks = {
    headquarters:   string;
    homepage:       string;
    id:             number;
    logo_path:      string;
    name:           string;
    origin_country: string;
}
