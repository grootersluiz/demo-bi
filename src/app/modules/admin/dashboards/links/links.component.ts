import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'links',
    templateUrl: './links.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./links.component.scss'],
})
export class LinksComponent {
    onClickGLPI() {
        window.open('http://10.1.12.183/glpi/');
    }
    onClickAgilize() {
        window.open('http://sistemas.jspecas.com.br/sistemas/public/login');
    }
    onClickNormas() {
        window.open(
            'https://jspecas.sharepoint.com/sites/processosjs?xsdata=MDV8MDF8fGM1MjlmNGIzMmM4ZDRhYjliMWMzMDhkYjc5NzdhMzZifDExMTU4NjAyNWZjOTQyODk4OGNlNGFhZGVjOTFjZjkzfDB8MHw2MzgyMzczMjY5NTI4NzAzMzl8VW5rbm93bnxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKV0lqb2lNQzR3TGpBd01EQWlMQ0pRSWpvaVYybHVNeklpTENKQlRpSTZJazkwYUdWeUlpd2lWMVFpT2pFeGZRPT18MXxMMk5vWVhSekx6RTVPamN3WXpnM1lXWXdNems1TWpRd1l6aGlaREZsTWpkak1UTmpORE5sWWpNNFFIUm9jbVZoWkM1Mk1pOXRaWE56WVdkbGN5OHhOamc0TVRNMU9EazBNVGsyfDMzNDdmZWI1NmVjNTQ4ZjViMWMzMDhkYjc5NzdhMzZifGI3MWUxOWI4ZTc0MDQyN2NiNzg0NTMzNDQ2YzM2MGJk&sdata=ajZ6MUFlTEV6ZnlldkJzSmp5UHkwcHFjQVhkdHkzREFZQ0E5d2lpYXIvbz0%3d&ovuser=11158602-5fc9-4289-88ce-4aadec91cf93%2calexcarvalho%40jspecas.com.br&OR=Teams-HL&CT=1688135943974&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yMzA2MTgwMTUwNSIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3d%3d&SafelinksUrl=https%3a%2f%2fjspecas.sharepoint.com%2fsites%2fprocessosjs'
        );
    }
    onClickGupy() {
        window.open('https://niduu.com/web/');
    }
}
