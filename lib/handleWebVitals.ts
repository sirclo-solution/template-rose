import { TrackWebVitals } from '@sirclo/nexus'

export function handleWebVitals (metric: any){
    if(metric.label === 'web-vital'){
        TrackWebVitals(metric)
    }
}