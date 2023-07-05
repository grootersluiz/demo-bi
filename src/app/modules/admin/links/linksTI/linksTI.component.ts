import { AuthService } from '../../../../core/auth/auth.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'linksTI',
    templateUrl: './linksTI.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./linksTI.component.scss'],
})
export class LinksTIComponent {
    constructor(private _auth: AuthService){
        console.log(_auth.userID);
    }
    onClickLicenca() {
        window.open('https://painel.embratelcloud.com.br/servlet/Turbine/frm/single/');
    }
    onClickRepositorio() {
        window.open('https://jspecas.sharepoint.com/sites/sharepoint/Documentos%20Compartilhados/Forms/AllItems.aspx?xsdata=MDV8MDF8fGU3NGVjNmEzZWQwMjRlZDk3MzU3MDhkYjI5NzQ0ZGE1fDExMTU4NjAyNWZjOTQyODk4OGNlNGFhZGVjOTFjZjkzfDB8MHw2MzgxNDkzNTE2OTg2OTA5MDN8VW5rbm93bnxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKV0lqb2lNQzR3TGpBd01EQWlMQ0pRSWpvaVYybHVNeklpTENKQlRpSTZJazkwYUdWeUlpd2lWMVFpT2pFeGZRPT18MXxNVFkzT1RNek9ETTJPRFk0TnpzeE5qYzVNek00TXpZNE5qZzNPekU1T2pOa1pqZ3pOak5sTFRNeFlqY3RORGd3TVMwNU1XVXhMVGM1WXprMU5qVmhPRFEwWkY5ak5XUTFOV1UzWkMweU5UaGtMVFF5TTJFdFltVXdZaTAyTXpreE9XTTJZelUyTUdSQWRXNXhMbWRpYkM1emNHRmpaWE09fDljNzIwMmNiMDBhYzQyYWE3MzU3MDhkYjI5NzQ0ZGE1fGQwMmEyNTE5NmI0OTQxMDVhMzI5ZDRkNzdjZDQzOWQw&sdata=ZXcxdjdLeENkc1VLc25mRlVPTitiV2dRZHZSSzB3OEs1R1lteXN5SkU4Zz0%3D&ovuser=11158602-5fc9-4289-88ce-4aadec91cf93%2Calexcarvalho%2Eti%40jspecas%2Ecom%2Ebr&OR=Teams-HL&CT=1679338374276&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiIyNy8yMzAyMDUwMTQyMSIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D&SafelinksUrl=https%3A%2F%2Fjspecas%2Esharepoint%2Ecom%2Fsites%2Fsharepoint%2FDocumentos%2520Compartilhados%2FForms%2FAllItems%2Easpx');
    }
    onClickGrafana() {
        window.open('http://10.1.12.189:3000/');
    }
    onClickZabbix() {
        window.open('http://10.1.12.189/zabbix/');
    }
    onClickFortclient() {
        window.open('https://forticlient.forticloud.com/static/client/index.html');
    }
    onClickOracle() {
        window.open('https://www.oracle.com/br/cloud/sign-in.html');
    }
}
